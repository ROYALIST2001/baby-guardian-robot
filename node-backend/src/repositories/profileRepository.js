// FILE: src/repositories/profileRepository.js
// JOB: Talk to the "profiles" table. Only read and write.

const supabase = require("../config/supabase");

// Insert a new profile row.
// The id must be the same id as the user in auth.users.
async function insert(profile) {
   const result = await supabase.from("profiles").insert(profile).select().single();
   return result;
}

// Get one profile by user id.
async function findOne(userId) {
   const result = await supabase.from("profiles").select("*").eq("id", userId).single();
   return result;
}

// NEW: save the phone's push token for this parent.
async function savePushToken(userId, pushToken) {
   const result = await supabase
      .from("profiles")
      .update({ push_token: pushToken })
      .eq("id", userId)
      .select()
      .single();
   return result;
}

// NEW: read just the push token for this parent.
// The worker uses this to know where to send the notification.
async function findPushToken(userId) {
   const result = await supabase
      .from("profiles")
      .select("push_token")
      .eq("id", userId)
      .single();
   return result;
}

module.exports = {
   insert: insert,
   findOne: findOne,
   savePushToken: savePushToken,
   findPushToken: findPushToken,
};
