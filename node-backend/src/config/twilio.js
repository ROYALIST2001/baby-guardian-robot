// FILE: src/config/twilio.js
// JOB: Create the Twilio connection once, IF the keys are set.
//      If they are not, the system still runs. It just logs instead.

const twilio = require("twilio");

// Read the three values from .env.
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Is Twilio usable? Only if all three values exist.
const isAvailable = Boolean(ACCOUNT_SID && AUTH_TOKEN && PHONE_NUMBER);

// Build the client only if we can. Otherwise leave it null.
let client = null;

if (isAvailable) {
   client = twilio(ACCOUNT_SID, AUTH_TOKEN);
   console.log("Twilio: ready. SMS and calls are switched on.");
} else {
   console.log("Twilio: keys not set. SMS and calls will be logged only.");
}

module.exports = {
   client: client,
   isAvailable: isAvailable,
   fromNumber: PHONE_NUMBER,
};
