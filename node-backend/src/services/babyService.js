// FILE: src/services/babyService.js
// JOB: The rules for babies. Passes the parentId down to the repository.

const babyRepository = require("../repositories/babyRepository");

// Get all babies for this parent.
async function getAllBabies(parentId) {
   const result = await babyRepository.findAll(parentId);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Get one baby for this parent.
async function getBaby(babyId, parentId) {
   const result = await babyRepository.findOne(babyId, parentId);
   if (result.error) {
      throw new Error("Baby not found");
   }
   return result.data;
}

// Create a baby for this parent.
async function createBaby(parentId, babyInput) {
   // Rule: a baby must have a name.
   if (!babyInput.name) {
      throw new Error("name is required");
   }

   // Build the row. The parent_id comes from the token, not the body.
   const baby = {
      parent_id: parentId,
      name: babyInput.name,
      birth_date: babyInput.birth_date,
      notes: babyInput.notes,
   };

   const result = await babyRepository.insert(baby);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Update a baby for this parent.
async function updateBaby(babyId, parentId, changes) {
   const result = await babyRepository.update(babyId, parentId, changes);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Delete a baby for this parent.
async function deleteBaby(babyId, parentId) {
   const result = await babyRepository.remove(babyId, parentId);
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
