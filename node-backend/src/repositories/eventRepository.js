// FILE: src/repositories/eventRepository.js
// JOB: Talk to the "events" table. Only read and write.

const supabase = require("../config/supabase");

// Get events, newest first, at most 100 rows.
async function findAll() {
   const result = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
   return result;
}

// Mark one event as resolved (set resolved = true).
async function markResolved(eventId) {
   const result = await supabase
      .from("events")
      .update({ resolved: true })
      .eq("id", eventId)
      .select()
      .single();
   return result;
}

module.exports = {
   findAll: findAll,
   markResolved: markResolved,
};
