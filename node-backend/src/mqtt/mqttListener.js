// FILE: src/mqtt/mqttListener.js
// JOB: Listen for robot messages, use the AI, think, and RUN the brain's commands.

const mqttClient = require("../config/mqtt");
const socket = require("../config/socket");
const brainClient = require("../services/brainClient");
const aiClient = require("../services/aiClient");
const modeService = require("../services/modeService");
const commandService = require("../services/commandService"); // new
const readingService = require("../services/readingService");
const eventService = require("../services/eventService");

const SENSOR_TOPIC = "babyguardian/sensors";
const EVENT_TOPIC = "babyguardian/events";
const AUDIO_TOPIC = "babyguardian/audio";
const IMAGE_TOPIC = "babyguardian/image";

// ---- NEW: run the list of commands the brain asked for ----
// The brain suggests. This function decides what is allowed, and sends it.
async function runBrainCommands(commands, isEmergency) {
   // Nothing to do.
   if (!commands || commands.length === 0) {
      return;
   }

   // Read the current mode. Movement is only allowed in auto mode,
   // so the AI never fights the parent for control.
   const mode = await modeService.getMode();

   // Go through each command one at a time.
   for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      try {
         // ---- MOVEMENT ----
         if (cmd.command === "move") {
            // A stop command is always allowed. Stopping is never dangerous.
            const isStop = cmd.direction === "stop";

            if (mode === "auto" || isStop) {
               commandService.sendMove(cmd.direction);
            } else {
               console.log("SKIPPED move: the parent is driving (manual mode)");
            }
         }

         // ---- MUSIC ----
         // Allowed in both modes. Music does not fight the parent.
         if (cmd.command === "music") {
            commandService.sendMusic(cmd.action, cmd.track);
         }

         // ---- ALARM ----
         // Always allowed. Safety comes first.
         if (cmd.command === "alarm") {
            commandService.sendAlarm(cmd.action);
         }
      } catch (error) {
         // One bad command must not stop the rest.
         console.log("Command failed:", error.message);
      }
   }
}

// ---- Save an event, push it live, think about it, and act ----
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
   if (!decision) {
      return;
   }

   console.log("BRAIN decision:", decision.action, "-", decision.action_result);

   // Step 4: on an emergency, force the robot back to manual mode.
   const isEmergency = decision.action === "emergency";
   if (isEmergency) {
      await modeService.setMode("manual", "emergency: " + eventData.event_type);
   }

   // Step 5: NEW. Actually run the commands the brain asked for.
   await runBrainCommands(decision.commands, isEmergency);
}

function start() {
   mqttClient.on("connect", function () {
      console.log("MQTT: connected to the broker");
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

         // ---------- DIRECT EVENTS (smoke, fire, fall) ----------
         if (topic === EVENT_TOPIC) {
            await handleEvent(data, io);
         }

         // ---------- AUDIO (the AI must listen) ----------
         if (topic === AUDIO_TOPIC) {
            console.log("MQTT: audio clip received, asking the AI...");

            const audioBytes = Buffer.from(data.audio, "base64");
            const result = await aiClient.detectCry(data.baby_id, audioBytes);

            if (!result) {
               console.log("MQTT: AI gave no answer for the audio");
               return;
            }

            console.log("AI heard:", result.label, "(score", result.score + ")");

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

            const imageBytes = Buffer.from(data.image, "base64");
            const result = await aiClient.detectBaby(data.baby_id, imageBytes);

            if (!result) {
               console.log("MQTT: AI gave no answer for the image");
               return;
            }

            console.log("AI saw:", result.count, "person(s)");

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
