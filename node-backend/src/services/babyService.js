// FILE: src/services/babyService.js
// JOB: The rules and logic for babies. Calls the repository for data.

const babyRepository = require("../repositories/babyRepository");

// Get the list of all babies.
async function getAllBabies() {
   const result = await babyRepository.findAll();
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Get one baby by id.
async function getBaby(babyId) {
   const result = await babyRepository.findOne(babyId);
   if (result.error) {
      throw new Error("Baby not found");
   }
   return result.data;
}

// Create a new baby.
async function createBaby(babyInput) {
   // Rule: a baby must have a name and a parent_id.
   if (!babyInput.name || !babyInput.parent_id) {
      throw new Error("name and parent_id are required");
   }
   const result = await babyRepository.insert(babyInput);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Update a baby.
async function updateBaby(babyId, changes) {
   const result = await babyRepository.update(babyId, changes);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Delete a baby.
async function deleteBaby(babyId) {
   const result = await babyRepository.remove(babyId);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return true;
}

module.exports = {
   getAllBabies: getAllBabies,
   getBaby: getBaby,
   createBaby: createBaby,
   updateBaby: updateBaby,
   deleteBaby: deleteBaby,
};
