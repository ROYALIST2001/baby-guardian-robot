// FILE: simulate.js
// JOB: Pretend to be the robot. Publish fake sensor data and events.

const mqtt = require("mqtt");

// Connect to the same broker as the backend.
const brokerAddress = "mqtts://" + process.env.MQTT_HOST + ":" + process.env.MQTT_PORT;
const client = mqtt.connect(brokerAddress, {
   username: process.env.MQTT_USERNAME,
   password: process.env.MQTT_PASSWORD,
});

// The baby and parent this fake robot belongs to (from .env).
const BABY_ID = process.env.TEST_BABY_ID;
const PARENT_ID = process.env.TEST_PARENT_ID;

// Helper: a random number between two values, rounded to one decimal.
function randomBetween(min, max) {
   const value = Math.random() * (max - min) + min;
   return Math.round(value * 10) / 10;
}

// Runs once when connected to the broker.
client.on("connect", function () {
   console.log("Simulator: connected. The fake robot is alive.");

   // Every 5 seconds, send one sensor reading.
   setInterval(function () {
      // A list of possible readings.
      const choices = [
         { sensor_type: "temperature", value: randomBetween(24, 30), unit: "C" },
         { sensor_type: "humidity", value: randomBetween(40, 70), unit: "%" },
         { sensor_type: "gas", value: randomBetween(80, 150), unit: "ppm" },
      ];

      // Pick one reading at random.
      const pick = choices[Math.floor(Math.random() * choices.length)];

      // Build the full message.
      const message = {
         baby_id: BABY_ID,
         parent_id: PARENT_ID,
         sensor_type: pick.sensor_type,
         value: pick.value,
         unit: pick.unit,
      };

      // Publish it to the sensors topic.
      client.publish("babyguardian/sensors", JSON.stringify(message), { qos: 1 });
      console.log("Simulator: sent", pick.sensor_type, "=", pick.value);
   }, 5000);

   // Every 20 seconds, maybe send an event.
   setInterval(function () {
      const chance = Math.random();
      let event = null;

      if (chance < 0.3) {
         // 30 percent: the baby is crying (a warning).
         event = {
            event_type: "crying",
            severity: "warning",
            description: "Crying detected",
         };
      } else if (chance < 0.4) {
         // 10 percent: smoke detected (an emergency).
         event = {
            event_type: "smoke",
            severity: "emergency",
            description: "Smoke detected",
         };
      }
      // Otherwise: all calm, send nothing.

      if (event) {
         event.baby_id = BABY_ID;
         event.parent_id = PARENT_ID;
         client.publish("babyguardian/events", JSON.stringify(event), { qos: 1 });
         console.log("Simulator: sent event ->", event.event_type);
      }
   }, 20000);
});

client.on("error", function (err) {
   console.log("Simulator MQTT error:", err.message);
});
