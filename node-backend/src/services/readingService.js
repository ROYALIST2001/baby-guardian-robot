// FILE: src/services/readingService.js
// JOB: The rules for readings. Passes parentId down.

const readingRepository = require("../repositories/readingRepository");

// Get readings for this parent, with an optional baby filter.
async function getReadings(parentId, babyId) {
   const result = await readingRepository.findAll(parentId, babyId);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Create a reading for this parent.
async function createReading(parentId, readingInput) {
   // Rule: baby_id and sensor_type are required.
   if (!readingInput.baby_id || !readingInput.sensor_type) {
      throw new Error("baby_id and sensor_type are required");
   }

   // The parent_id comes from the token, not the body.
   const reading = {
      baby_id: readingInput.baby_id,
      parent_id: parentId,
      sensor_type: readingInput.sensor_type,
      value: readingInput.value,
      unit: readingInput.unit,
   };

   const result = await readingRepository.insert(reading);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

module.exports = {
   getReadings: getReadings,
   createReading: createReading,
};
