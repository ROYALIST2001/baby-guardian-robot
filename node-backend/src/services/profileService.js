// FILE: src/services/profileService.js
// JOB: The rules for parent profiles and push tokens.

const profileRepository = require("../repositories/profileRepository");

// Save the phone's push token for this parent.
async function savePushToken(parentId, pushToken) {
   // Rule: a token is required.
   if (!pushToken) {
      throw new Error("push_token is required");
   }

   // Rule: an Expo token always starts this way.
   // This catches typos and wrong values early.
   if (!pushToken.startsWith("ExponentPushToken")) {
      throw new Error("That does not look like an Expo push token");
   }

   const result = await profileRepository.savePushToken(parentId, pushToken);
   if (result.error) {
      throw new Error(result.error.message);
   }

   return result.data;
}

// Get the push token for this parent.
// Returns null if they have none, which is a normal case.
async function getPushToken(parentId) {
   const result = await profileRepository.findPushToken(parentId);

   if (result.error) {
      return null;
   }

   if (!result.data || !result.data.push_token) {
      return null;
   }

   return result.data.push_token;
}

// NEW: get the parent's phone number, for SMS and calls.
// Returns null if they have none.
async function getPhoneNumber(parentId) {
   const result = await profileRepository.findOne(parentId);

   if (result.error) {
      return null;
   }

   if (!result.data || !result.data.phone) {
      return null;
   }

   return result.data.phone;
}

module.exports = {
   savePushToken: savePushToken,
   getPushToken: getPushToken,
   getPhoneNumber: getPhoneNumber,
};
