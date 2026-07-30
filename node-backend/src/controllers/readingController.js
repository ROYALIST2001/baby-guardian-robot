// FILE: src/controllers/readingController.js
// JOB: Read the request, call the service, send the response.

const readingService = require("../services/readingService");

// GET readings (optionally filtered by ?baby_id=...)
async function getAll(req, res) {
   try {
      const babyId = req.query.baby_id; // read the value after "?"
      const readings = await readingService.getReadings(babyId);
      res.json(readings);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// POST create a reading
async function create(req, res) {
   try {
      const newReading = await readingService.createReading(req.body);
      res.status(201).json(newReading);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   getAll: getAll,
   create: create,
};
