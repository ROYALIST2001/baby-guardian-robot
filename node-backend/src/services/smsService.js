// FILE: src/services/smsService.js
// JOB: Send an emergency SMS and place an emergency phone call.

const twilioConfig = require("../config/twilio");

// ---- Build the words for an emergency ----
// Pure logic, so it is easy to test.
function buildEmergencyText(event) {
   const type = event.event_type;

   if (type === "smoke") {
      return "BABY GUARDIAN EMERGENCY. Smoke has been detected in your baby's room. Please check immediately.";
   }

   if (type === "fire") {
      return "BABY GUARDIAN EMERGENCY. Fire has been detected in your baby's room. Please check immediately.";
   }

   if (type === "fall") {
      return "BABY GUARDIAN EMERGENCY. A fall has been detected. Please check on your baby immediately.";
   }

   return (
      "BABY GUARDIAN EMERGENCY. " + type + " detected. Please check on your baby."
   );
}

// ---- Send an SMS ----
// Throws if it fails, so the caller can decide what to do.
async function sendSms(toNumber, event) {
   const text = buildEmergencyText(event);

   // If Twilio is not set up, log what we WOULD send and stop.
   // This is not a failure. The system keeps working.
   if (!twilioConfig.isAvailable) {
      console.log("SMS (not sent, Twilio off) ->", toNumber, "|", text);
      return { simulated: true };
   }

   const message = await twilioConfig.client.messages.create({
      body: text,
      from: twilioConfig.fromNumber,
      to: toNumber,
   });

   console.log("SMS sent to", toNumber, "| id", message.sid);
   return message;
}

// ---- Place a phone call that speaks the warning ----
async function makeCall(toNumber, event) {
   const text = buildEmergencyText(event);

   // TwiML tells Twilio what to say when the call is answered.
   // <Say> means read this out loud.
   // We say it twice, in case the parent is half asleep.
   const twiml =
      "<Response>" +
      '<Say voice="alice">' +
      text +
      "</Say>" +
      '<Pause length="1"/>' +
      '<Say voice="alice">' +
      text +
      "</Say>" +
      "</Response>";

   if (!twilioConfig.isAvailable) {
      console.log("CALL (not made, Twilio off) ->", toNumber, "|", text);
      return { simulated: true };
   }

   const call = await twilioConfig.client.calls.create({
      twiml: twiml,
      from: twilioConfig.fromNumber,
      to: toNumber,
   });

   console.log("CALL placed to", toNumber, "| id", call.sid);
   return call;
}

module.exports = {
   buildEmergencyText: buildEmergencyText,
   sendSms: sendSms,
   makeCall: makeCall,
};
