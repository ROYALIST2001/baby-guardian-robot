// FILE: simulate.js
// JOB: Pretend to be the robot. Send sensor numbers, and REAL audio
//      and image files, so the AI has something to think about.

const mqtt = require("mqtt");
const fs = require("fs"); // fs lets us read files from disk

const brokerAddress = "mqtts://" + process.env.MQTT_HOST + ":" + process.env.MQTT_PORT;
const client = mqtt.connect(brokerAddress, {
   username: process.env.MQTT_USERNAME,
   password: process.env.MQTT_PASSWORD,
});

const BABY_ID = process.env.TEST_BABY_ID;
const PARENT_ID = process.env.TEST_PARENT_ID;

// Helper: a random number between two values, rounded to one decimal.
function randomBetween(min, max) {
   const value = Math.random() * (max - min) + min;
   return Math.round(value * 10) / 10;
}

// Helper: read a file and turn it into Base64 text.
// Base64 lets us send a file inside a text message.
function fileToBase64(path) {
   const bytes = fs.readFileSync(path); // read the raw file
   return bytes.toString("base64"); // turn it into text
}

client.on("connect", function () {
   console.log("Simulator: connected. The fake robot is alive.");

   // ---------- Every 5 seconds: one sensor reading ----------
   setInterval(function () {
      const choices = [
         { sensor_type: "temperature", value: randomBetween(24, 30), unit: "C" },
         { sensor_type: "humidity", value: randomBetween(40, 70), unit: "%" },
         { sensor_type: "gas", value: randomBetween(80, 150), unit: "ppm" },
      ];
      const pick = choices[Math.floor(Math.random() * choices.length)];

      const message = {
         baby_id: BABY_ID,
         parent_id: PARENT_ID,
         sensor_type: pick.sensor_type,
         value: pick.value,
         unit: pick.unit,
      };

      client.publish("babyguardian/sensors", JSON.stringify(message), { qos: 1 });
      console.log("Simulator: sent", pick.sensor_type, "=", pick.value);
   }, 5000);

   // ---------- Every 15 seconds: send a real audio clip ----------
   // The robot's microphone would do this. It sends SOUND, not a conclusion.
   setInterval(function () {
      try {
         const audioBase64 = fileToBase64("./samples/cry.mp3");

         const message = {
            baby_id: BABY_ID,
            parent_id: PARENT_ID,
            audio: audioBase64,
         };

         client.publish("babyguardian/audio", JSON.stringify(message), { qos: 1 });
         console.log("Simulator: sent an audio clip. The AI will decide what it is.");
      } catch (error) {
         console.log("Simulator: could not read the audio file:", error.message);
      }
   }, 15000);

   // ---------- Every 25 seconds: send a real camera image ----------
   setInterval(function () {
      try {
         const imageBase64 = fileToBase64("./samples/baby.jpg");

         const message = {
            baby_id: BABY_ID,
            parent_id: PARENT_ID,
            image: imageBase64,
         };

         client.publish("babyguardian/image", JSON.stringify(message), { qos: 1 });
         console.log("Simulator: sent a camera image. The AI will look at it.");
      } catch (error) {
         console.log("Simulator: could not read the image file:", error.message);
      }
   }, 25000);

   // ---------- Every 40 seconds: maybe a sensor emergency (no AI) ----------
   // Smoke and fire come from real sensors, so no AI is needed for these.
   setInterval(function () {
      const chance = Math.random();

      if (chance < 0.15) {
         const event = {
            baby_id: BABY_ID,
            parent_id: PARENT_ID,
            event_type: "smoke",
            severity: "emergency",
            description: "Smoke detected by the gas sensor",
         };
         client.publish("babyguardian/events", JSON.stringify(event), { qos: 1 });
         console.log("Simulator: SMOKE detected by sensor");
      }
   }, 40000);
});

client.on("error", function (err) {
   console.log("Simulator MQTT error:", err.message);
});
