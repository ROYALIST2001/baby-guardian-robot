// FILE: src/controllers/eventController.js
// JOB: Read the request, call the service, send the response.

const eventService = require("../services/eventService");

// GET all events
async function getAll(req, res) {
   try {
      const events = await eventService.getEvents();
      res.json(events);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// PUT mark an event as resolved
async function resolve(req, res) {
   try {
      const eventId = req.params.id;
      const updated = await eventService.resolveEvent(eventId);
      res.json(updated);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   getAll: getAll,
   resolve: resolve,
};
