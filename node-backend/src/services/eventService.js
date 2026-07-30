// FILE: src/services/eventService.js
// JOB: The rules and logic for events. Calls the repository.

const eventRepository = require("../repositories/eventRepository");

// Get the list of events.
async function getEvents() {
   const result = await eventRepository.findAll();
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

// Mark an event as resolved.
async function resolveEvent(eventId) {
   const result = await eventRepository.markResolved(eventId);
   if (result.error) {
      throw new Error("Could not resolve event");
   }
   return result.data;
}

module.exports = {
   getEvents: getEvents,
   resolveEvent: resolveEvent,
};
