// FILE: src/services/pushService.js
// JOB: Send a real push notification through Expo.

const axios = require("axios");

// Expo's push address. No account or key needed.
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// ---- Turn an event into a title and message the parent will read ----
// Pure logic, so it is easy to test.
function buildMessage(event) {
   const type = event.event_type;

   if (type === "crying") {
      return {
         title: "Your baby is crying",
         body: "The robot heard crying and is comforting the baby.",
      };
   }

   if (type === "distress") {
      return {
         title: "Your baby looks upset",
         body: "The camera saw distress on your baby's face.",
      };
   }

   if (type === "baby_not_visible") {
      return {
         title: "Cannot see your baby",
         body: "The camera cannot find your baby right now.",
      };
   }

   if (type === "smoke") {
      return {
         title: "EMERGENCY: Smoke detected",
         body: "Smoke has been detected in the room. Check immediately.",
      };
   }

   if (type === "fire") {
      return {
         title: "EMERGENCY: Fire detected",
         body: "Fire has been detected in the room. Check immediately.",
      };
   }

   if (type === "fall") {
      return {
         title: "EMERGENCY: Fall detected",
         body: "A fall has been detected. Check on your baby immediately.",
      };
   }

   // A safe default for anything we did not plan for.
   return {
      title: "Baby Guardian alert",
      body: "Something happened: " + type,
   };
}

// ---- Send the notification ----
// Throws an error if it fails, so the queue will retry it.
async function sendPush(pushToken, event, isEmergency) {
   const message = buildMessage(event);

   // Build the message in the shape Expo expects.
   const payload = {
      to: pushToken,
      title: message.title,
      body: message.body,
      sound: "default",
      // High priority means the phone shows it straight away,
      // even in battery saving mode. We only use it for emergencies.
      priority: isEmergency ? "high" : "normal",
      // Extra data the app can read if the parent taps the notification.
      data: {
         event_type: event.event_type,
         baby_id: event.baby_id,
      },
   };

   const response = await axios.post(EXPO_PUSH_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
   });

   // Expo replies with a status for the message.
   const result = response.data.data;

   // If Expo says the message was rejected, throw so the queue retries.
   if (result && result.status === "error") {
      throw new Error("Expo rejected the push: " + result.message);
   }

   console.log("PUSH sent:", message.title);
   return result;
}

module.exports = {
   buildMessage: buildMessage,
   sendPush: sendPush,
};
