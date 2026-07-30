// FILE: src/services/eventService.js
// JOB: The rules for events. Passes parentId down.

const eventRepository = require("../repositories/eventRepository");

// Get this parent's events.
async function getEvents(parentId) {
   const result = await eventRepository.findAll(parentId);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Resolve one of this parent's events.
async function resolveEvent(eventId, parentId) {
   const result = await eventRepository.markResolved(eventId, parentId);
   if (result.error) {
      throw new Error("Could not resolve event");
   }
   return result.data;
}

module.exports = {
   getEvents: getEvents,
   resolveEvent: resolveEvent,
};
