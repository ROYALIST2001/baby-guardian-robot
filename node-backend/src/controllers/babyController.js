// FILE: src/controllers/babyController.js
// JOB: Read the request, call the service, send the response.

const babyService = require("../services/babyService");

// GET all babies
async function getAll(req, res) {
   try {
      const babies = await babyService.getAllBabies();
      res.json(babies); // status 200 by default
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// GET one baby by id
async function getOne(req, res) {
   try {
      const babyId = req.params.id; // read the id from the URL
      const baby = await babyService.getBaby(babyId);
      res.json(baby);
   } catch (error) {
      res.status(404).json({ error: error.message });
   }
}

// POST create a baby
async function create(req, res) {
   try {
      const newBaby = await babyService.createBaby(req.body); // data comes in req.body
      res.status(201).json(newBaby); // 201 means created
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// PUT update a baby
async function update(req, res) {
   try {
      const babyId = req.params.id;
      const updated = await babyService.updateBaby(babyId, req.body);
      res.json(updated);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// DELETE a baby
async function remove(req, res) {
   try {
      const babyId = req.params.id;
      await babyService.deleteBaby(babyId);
      res.status(204).send(); // 204 means success, nothing to send back
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
