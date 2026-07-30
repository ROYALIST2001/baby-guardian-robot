// FILE: src/repositories/eventRepository.js
// JOB: Talk to the "events" table, filtered by parent.

const supabase = require("../config/supabase");

// Get this parent's events, newest first.
async function findAll(parentId) {
   const result = await supabase
      .from("events")
      .select("*")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: false })
      .limit(100);
   return result;
}

// Mark one event resolved, but only if it belongs to this parent.
async function markResolved(eventId, parentId) {
   const result = await supabase
      .from("events")
      .update({ resolved: true })
      .eq("id", eventId)
      .eq("parent_id", parentId)
      .select()
      .single();
   return result;
}

module.exports = {
   findAll: findAll,
   markResolved: markResolved,
};
