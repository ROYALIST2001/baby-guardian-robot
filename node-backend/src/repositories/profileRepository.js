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

module.exports = {
   insert: insert,
   findOne: findOne,
};
