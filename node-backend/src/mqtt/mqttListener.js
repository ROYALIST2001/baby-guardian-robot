// FILE: src/mqtt/mqttListener.js
// JOB: Listen for robot messages, save them, then push them live.

const mqttClient = require("../config/mqtt");
const socket = require("../config/socket"); // new: to emit live updates
const readingService = require("../services/readingService");
const eventService = require("../services/eventService");
const brainClient = require("../services/brainClient");

const SENSOR_TOPIC = "babyguardian/sensors";
const EVENT_TOPIC = "babyguardian/events";

function start() {
   mqttClient.on("connect", function () {
      console.log("MQTT: connected to the broker");
      mqttClient.subscribe(SENSOR_TOPIC, { qos: 1 });
      mqttClient.subscribe(EVENT_TOPIC, { qos: 1 });
      console.log("MQTT: listening on sensors and events topics");
   });

   mqttClient.on("error", function (err) {
      console.log("MQTT error:", err.message);
   });

   mqttClient.on("message", async function (topic, messageBuffer) {
      const text = messageBuffer.toString();

      // Turn the text into an object. Stop safely if it is broken.
      let data;
      try {
         data = JSON.parse(text);
      } catch (parseError) {
         console.log("MQTT: received a broken message, ignoring it");
         return;
      }

      // Get the Socket.IO server so we can push updates.
      const io = socket.getIo();

      try {
         if (topic === SENSOR_TOPIC) {
            // Step 1: save the reading to the database.
            await readingService.createReading(data.parent_id, data);
            console.log("MQTT: saved reading ->", data.sensor_type, "=", data.value);

            // Step 2: push it live to every connected app.
            // The message name is "sensor_reading". The app listens for this name.
            if (io) {
               io.emit("sensor_reading", data);
            }
         }

         if (topic === EVENT_TOPIC) {
            // Step 1: save the event.
            await eventService.createEvent(data.parent_id, data);
            console.log(
               "MQTT: saved event ->",
               data.event_type,
               "(" + data.severity + ")",
            );

            // Step 2: push it live.
            if (io) {
               io.emit("event", data);
            }
            // Step 3: NEW: ask the brain what to do about this event.
            const decision = await brainClient.askBrain(data);
            if (decision) {
               console.log(
                  "BRAIN decision:",
                  decision.action,
                  "-",
                  decision.action_result,
               );
            }
         }
      } catch (saveError) {
         console.log("MQTT: could not save message:", saveError.message);
      }
   });
}

module.exports = { start: start };
