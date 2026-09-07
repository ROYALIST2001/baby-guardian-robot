// FILE: src/services/alertService.js
// JOB: THE ALERT RULES. Decide what kind of alert an event deserves.

const { queueNotification, queueEmergency } = require("../queues/alertQueue");

// ---- Layer 1: DECIDE (pure logic, easy to test) ----
// Takes an event, returns what should happen. Touches nothing else.
function decideAlert(event) {
   const severity = event.severity;

   if (severity === "emergency") {
      return { sendEmergency: true, sendNotification: false };
   }

   if (severity === "warning") {
      return { sendEmergency: false, sendNotification: true };
   }

   // "info" or anything unknown: stay quiet.
   return { sendEmergency: false, sendNotification: false };
}

// ---- Layer 2: ACT (carries out the decision) ----
async function handleAlert(event) {
   const decision = decideAlert(event);

   if (decision.sendEmergency) {
      await queueEmergency(event);
      return;
   }

   if (decision.sendNotification) {
      await queueNotification(event);
      return;
   }

   console.log("ALERT: nothing to send for", event.event_type);
}

module.exports = {
   decideAlert: decideAlert,
   handleAlert: handleAlert,
};
