// FILE: src/repositories/readingRepository.js
// JOB: Talk to the "sensor_readings" table, filtered by parent.

const supabase = require("../config/supabase");

// Get this parent's readings. Optional baby filter.
async function findAll(parentId, babyId) {
   let query = supabase
      .from("sensor_readings")
      .select("*")
      .eq("parent_id", parentId) // only this parent's readings
      .order("recorded_at", { ascending: false })
      .limit(100);

   if (babyId) {
      query = query.eq("baby_id", babyId);
   }

   const result = await query;
   return result;
}

// Insert a new reading (parent_id is set by us).
async function insert(reading) {
   const result = await supabase
      .from("sensor_readings")
      .insert(reading)
      .select()
      .single();
   return result;
}

module.exports = {
   findAll: findAll,
   insert: insert,
};
