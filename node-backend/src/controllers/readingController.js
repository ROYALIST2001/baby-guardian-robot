// FILE: src/controllers/readingController.js
// JOB: Read the request, get the user id, call the service.

const readingService = require("../services/readingService");

// GET readings (optional ?baby_id=...)
async function getAll(req, res) {
   try {
      const parentId = req.user.id;
      const babyId = req.query.baby_id;
      const readings = await readingService.getReadings(parentId, babyId);
      res.json(readings);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// POST create a reading
async function create(req, res) {
   try {
      const parentId = req.user.id;
      const newReading = await readingService.createReading(parentId, req.body);
      res.status(201).json(newReading);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   getAll: getAll,
   create: create,
};
