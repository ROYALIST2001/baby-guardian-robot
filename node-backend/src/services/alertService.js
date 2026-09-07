// FILE: src/services/alertService.js
// JOB: THE ALERT RULES. Decide what kind of alert an event deserves,
//      and whether to stay quiet right now.

const { queueNotification, queueEmergency } = require("../queues/alertQueue");
const profileService = require("./profileService");
const quietHours = require("./quietHours");

// ---- Layer 1: DECIDE (pure logic, easy to test) ----
// isQuiet says whether we are inside the parent's quiet hours.
function decideAlert(event, isQuiet) {
   const severity = event.severity;

   // Emergencies ALWAYS go through, even during quiet hours.
   // A fire must wake the parent.
   if (severity === "emergency") {
      return { sendEmergency: true, sendNotification: false, silenced: false };
   }

   if (severity === "warning") {
      // During quiet hours, a warning is saved but not sent.
      // The robot is already handling it, and sleep matters.
      if (isQuiet) {
         return { sendEmergency: false, sendNotification: false, silenced: true };
      }
      return { sendEmergency: false, sendNotification: true, silenced: false };
   }

   // "info" or anything unknown: stay quiet.
   return { sendEmergency: false, sendNotification: false, silenced: false };
}

// ---- Layer 2: ACT (carries out the decision) ----
async function handleAlert(event) {
   // Step 1: find out if right now is quiet time for this parent.
   let isQuiet = false;

   try {
      const settings = await profileService.getQuietHours(event.parent_id);
      const currentHour = new Date().getHours();
      isQuiet = quietHours.isQuietTime(settings, currentHour);
   } catch (error) {
      // If we cannot read the settings, assume NOT quiet.
      // When unsure, alerting is safer than silence.
      console.log("ALERT: could not read quiet hours, alerting anyway");
      isQuiet = false;
   }

   // Step 2: apply the rules.
   const decision = decideAlert(event, isQuiet);

   if (decision.sendEmergency) {
      await queueEmergency(event);
      return;
   }

   if (decision.sendNotification) {
      await queueNotification(event);
      return;
   }

   if (decision.silenced) {
      console.log("ALERT: quiet hours. Saved but not sent:", event.event_type);
      return;
   }

   console.log("ALERT: nothing to send for", event.event_type);
}

module.exports = {
   decideAlert: decideAlert,
   handleAlert: handleAlert,
};
