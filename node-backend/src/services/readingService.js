// FILE: src/services/readingService.js
// JOB: The rules and logic for readings. Calls the repository.

const readingRepository = require("../repositories/readingRepository");

// Get readings, with an optional baby filter.
async function getReadings(babyId) {
   const result = await readingRepository.findAll(babyId);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Create a new reading.
async function createReading(readingInput) {
   // Rule: these three fields are required.
   if (!readingInput.baby_id || !readingInput.parent_id || !readingInput.sensor_type) {
      throw new Error("baby_id, parent_id and sensor_type are required");
   }
   const result = await readingRepository.insert(readingInput);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

module.exports = {
   getReadings: getReadings,
   createReading: createReading,
};
