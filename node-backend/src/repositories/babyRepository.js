// FILE: src/repositories/babyRepository.js
// JOB: Talk to the "babies" table. Every action uses the parentId
//      so a parent only touches their own rows.

const supabase = require("../config/supabase");

// Get all babies for one parent.
async function findAll(parentId) {
   const result = await supabase.from("babies").select("*").eq("parent_id", parentId); // only this parent's babies
   return result;
}

// Get one baby by id, but only if it belongs to this parent.
async function findOne(babyId, parentId) {
   const result = await supabase
      .from("babies")
      .select("*")
      .eq("id", babyId)
      .eq("parent_id", parentId) // both must match
      .single();
   return result;
}

// Insert a new baby. The parentId is set by us, not by the caller.
async function insert(baby) {
   const result = await supabase.from("babies").insert(baby).select().single();
   return result;
}

// Update a baby, but only if it belongs to this parent.
async function update(babyId, parentId, changes) {
   const result = await supabase
      .from("babies")
      .update(changes)
      .eq("id", babyId)
      .eq("parent_id", parentId)
      .select()
      .single();
   return result;
}

// Delete a baby, but only if it belongs to this parent.
async function remove(babyId, parentId) {
   const result = await supabase
      .from("babies")
      .delete()
      .eq("id", babyId)
      .eq("parent_id", parentId);
   return result;
}

module.exports = {
   findAll: findAll,
   findOne: findOne,
   insert: insert,
   update: update,
   remove: remove,
};
