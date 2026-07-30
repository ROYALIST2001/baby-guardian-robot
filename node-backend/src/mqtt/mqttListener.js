// FILE: src/mqtt/mqttListener.js
// JOB: Listen for robot messages and save them using our services.

const mqttClient = require("../config/mqtt");
const readingService = require("../services/readingService");
const eventService = require("../services/eventService");

// The two topics the robot publishes to.
const SENSOR_TOPIC = "babyguardian/sensors";
const EVENT_TOPIC = "babyguardian/events";

// This function is called once from server.js to start listening.
function start() {
   // Runs one time when the connection to the broker is ready.
   mqttClient.on("connect", function () {
      console.log("MQTT: connected to the broker");

      // Subscribe to both topics. qos 1 means the broker ensures delivery.
      mqttClient.subscribe(SENSOR_TOPIC, { qos: 1 });
      mqttClient.subscribe(EVENT_TOPIC, { qos: 1 });
      console.log("MQTT: listening on sensors and events topics");
   });

   // Runs if the connection has a problem.
   mqttClient.on("error", function (err) {
      console.log("MQTT error:", err.message);
   });

   // Runs every time a message arrives on any subscribed topic.
   mqttClient.on("message", async function (topic, messageBuffer) {
      // The message arrives as raw bytes. Turn it into text.
      const text = messageBuffer.toString();

      // Turn the text into a JSON object.
      // If the text is broken, stop safely instead of crashing.
      let data;
      try {
         data = JSON.parse(text);
      } catch (parseError) {
         console.log("MQTT: received a broken message, ignoring it");
         return;
      }

      // Decide what to do based on the topic.
      try {
         if (topic === SENSOR_TOPIC) {
            // Save the reading. parent_id comes from inside the message.
            await readingService.createReading(data.parent_id, data);
            console.log("MQTT: saved reading ->", data.sensor_type, "=", data.value);
         }

         if (topic === EVENT_TOPIC) {
            // Save the event.
            await eventService.createEvent(data.parent_id, data);
            console.log(
               "MQTT: saved event ->",
               data.event_type,
               "(" + data.severity + ")",
            );
         }
      } catch (saveError) {
         // If saving fails, print it but do not crash the server.
         console.log("MQTT: could not save message:", saveError.message);
      }
   });
}

module.exports = { start: start };
