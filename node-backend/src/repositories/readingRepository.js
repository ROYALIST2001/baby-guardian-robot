// FILE: src/repositories/readingRepository.js
// JOB: Talk to the "sensor_readings" table. Only read and write.

const supabase = require("../config/supabase");

// Get readings. If a babyId is given, filter by that baby.
async function findAll(babyId) {
   // Start building the query: newest first, at most 100 rows.
   let query = supabase
      .from("sensor_readings")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(100);

   // If the caller gave a babyId, add a filter.
   if (babyId) {
      query = query.eq("baby_id", babyId);
   }

   const result = await query;
   return result; // { data, error }
}

// Insert a new reading row.
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
