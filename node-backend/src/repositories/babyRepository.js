// FILE: src/repositories/babyRepository.js
// JOB: Talk to the "babies" table. Only read and write. No rules here.

const supabase = require("../config/supabase");

// Get all babies.
async function findAll() {
   const result = await supabase.from("babies").select("*");
   return result; // result contains { data, error }
}

// Get one baby by its id.
async function findOne(babyId) {
   const result = await supabase
      .from("babies")
      .select("*")
      .eq("id", babyId) // eq means "where id equals this value"
      .single(); // single means "expect exactly one row"
   return result;
}

// Insert a new baby row.
async function insert(baby) {
   const result = await supabase
      .from("babies")
      .insert(baby)
      .select() // ask the database to return the new row
      .single();
   return result;
}

// Update a baby by id.
async function update(babyId, changes) {
   const result = await supabase
      .from("babies")
      .update(changes)
      .eq("id", babyId)
      .select()
      .single();
   return result;
}

// Delete a baby by id.
async function remove(babyId) {
   const result = await supabase.from("babies").delete().eq("id", babyId);
   return result;
}

// Share all these functions.
module.exports = {
   findAll: findAll,
   findOne: findOne,
   insert: insert,
   update: update,
   remove: remove,
};
