// FILE: src/controllers/babyController.js
// JOB: Read the request, get the user id from req.user, call the service.

const babyService = require("../services/babyService");

// GET all babies for the logged-in parent
async function getAll(req, res) {
   try {
      const parentId = req.user.id; // set by the auth guard
      const babies = await babyService.getAllBabies(parentId);
      res.json(babies);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// GET one baby
async function getOne(req, res) {
   try {
      const parentId = req.user.id;
      const babyId = req.params.id;
      const baby = await babyService.getBaby(babyId, parentId);
      res.json(baby);
   } catch (error) {
      res.status(404).json({ error: error.message });
   }
}

// POST create a baby
async function create(req, res) {
   try {
      const parentId = req.user.id;
      const newBaby = await babyService.createBaby(parentId, req.body);
      res.status(201).json(newBaby);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// PUT update a baby
async function update(req, res) {
   try {
      const parentId = req.user.id;
      const babyId = req.params.id;
      const updated = await babyService.updateBaby(babyId, parentId, req.body);
      res.json(updated);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// DELETE a baby
async function remove(req, res) {
   try {
      const parentId = req.user.id;
      const babyId = req.params.id;
      await babyService.deleteBaby(babyId, parentId);
      res.status(204).send();
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

module.exports = {
   getAll: getAll,
   getOne: getOne,
   create: create,
   update: update,
   remove: remove,
};
