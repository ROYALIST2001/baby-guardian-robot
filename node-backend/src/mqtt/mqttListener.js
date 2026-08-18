// FILE: src/mqtt/mqttListener.js
// JOB: Listen for robot messages. Sensors and events are saved directly.
//      Audio and images are sent to the AI first, then become events.

const mqttClient = require("../config/mqtt");
const socket = require("../config/socket");
const brainClient = require("../services/brainClient");
const aiClient = require("../services/aiClient"); // new
const modeService = require("../services/modeService");
const readingService = require("../services/readingService");
const eventService = require("../services/eventService");

// The topics we listen to.
const SENSOR_TOPIC = "babyguardian/sensors";
const EVENT_TOPIC = "babyguardian/events";
const AUDIO_TOPIC = "babyguardian/audio"; // new
const IMAGE_TOPIC = "babyguardian/image"; // new

// ---- A shared helper: save an event, push it live, and think about it ----
// Both the direct events and the AI-created events use this, so the
// behaviour is identical no matter where the event came from.
async function handleEvent(eventData, io) {
   // Step 1: save it.
   await eventService.createEvent(eventData.parent_id, eventData);
   console.log("EVENT saved ->", eventData.event_type, "(" + eventData.severity + ")");

   // Step 2: push it live to the app.
   if (io) {
      io.emit("event", eventData);
   }

   // Step 3: ask the brain what to do.
   const decision = await brainClient.askBrain(eventData);
   if (decision) {
      console.log("BRAIN decision:", decision.action, "-", decision.action_result);

      // On an emergency, force the robot back to manual mode.
      if (decision.action === "emergency") {
         await modeService.setMode("manual", "emergency: " + eventData.event_type);
      }
   }
}

function start() {
   mqttClient.on("connect", function () {
      console.log("MQTT: connected to the broker");

      // Subscribe to all four topics.
      mqttClient.subscribe(SENSOR_TOPIC, { qos: 1 });
      mqttClient.subscribe(EVENT_TOPIC, { qos: 1 });
      mqttClient.subscribe(AUDIO_TOPIC, { qos: 1 });
      mqttClient.subscribe(IMAGE_TOPIC, { qos: 1 });
      console.log("MQTT: listening on sensors, events, audio and image topics");
   });

   mqttClient.on("error", function (err) {
      console.log("MQTT error:", err.message);
   });

   mqttClient.on("message", async function (topic, messageBuffer) {
      const text = messageBuffer.toString();

      let data;
      try {
         data = JSON.parse(text);
      } catch (parseError) {
         console.log("MQTT: received a broken message, ignoring it");
         return;
      }

      const io = socket.getIo();

      try {
         // ---------- SENSOR READINGS (no AI needed) ----------
         if (topic === SENSOR_TOPIC) {
            await readingService.createReading(data.parent_id, data);
            console.log("MQTT: saved reading ->", data.sensor_type, "=", data.value);

            if (io) {
               io.emit("sensor_reading", data);
            }
         }

         // ---------- DIRECT EVENTS (smoke, fire, fall: sensors, no AI) ----------
         if (topic === EVENT_TOPIC) {
            await handleEvent(data, io);
         }

         // ---------- AUDIO (the AI must listen) ----------
         if (topic === AUDIO_TOPIC) {
            console.log("MQTT: audio clip received, asking the AI...");

            // Step 1: turn the Base64 text back into raw bytes.
            const audioBytes = Buffer.from(data.audio, "base64");

            // Step 2: ask the AI what this sound is.
            const result = await aiClient.detectCry(data.baby_id, audioBytes);

            // If the AI failed, stop here quietly.
            if (!result) {
               console.log("MQTT: AI gave no answer for the audio");
               return;
            }

            console.log("AI heard:", result.label, "(score", result.score + ")");

            // Step 3: only create an event if the AI actually found crying.
            if (result.is_crying) {
               const cryEvent = {
                  baby_id: data.baby_id,
                  parent_id: data.parent_id,
                  event_type: "crying",
                  severity: "warning",
                  description: "Crying detected by AI: " + result.label,
               };
               await handleEvent(cryEvent, io);
            } else {
               console.log("MQTT: no crying in this clip. Nothing to do.");
            }
         }

         // ---------- IMAGE (the AI must look) ----------
         if (topic === IMAGE_TOPIC) {
            console.log("MQTT: image received, asking the AI...");

            // Step 1: turn the Base64 text back into raw bytes.
            const imageBytes = Buffer.from(data.image, "base64");

            // Step 2: ask the AI if a baby is visible.
            const result = await aiClient.detectBaby(data.baby_id, imageBytes);

            if (!result) {
               console.log("MQTT: AI gave no answer for the image");
               return;
            }

            console.log("AI saw:", result.count, "person(s)");

            // Step 3: if the baby is NOT visible, that is worth knowing.
            if (!result.baby_found) {
               const missingEvent = {
                  baby_id: data.baby_id,
                  parent_id: data.parent_id,
                  event_type: "baby_not_visible",
                  severity: "warning",
                  description: "The camera cannot see the baby",
               };
               await handleEvent(missingEvent, io);
            } else {
               console.log("MQTT: baby is visible. All is well.");
            }
         }
      } catch (error) {
         console.log("MQTT: could not handle message:", error.message);
      }
   });
}

module.exports = { start: start };
