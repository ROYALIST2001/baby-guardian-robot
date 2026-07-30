// FILE: src/services/eventService.js
// JOB: The rules for events. Calls the repository.

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

// NEW: create an event. The robot uses this through MQTT.
async function createEvent(parentId, eventInput) {
   // Rule: an event must have a type.
   if (!eventInput.event_type) {
      throw new Error("event_type is required");
   }

   // Build the row. parent_id comes from the message, not guessed.
   const event = {
      baby_id: eventInput.baby_id,
      parent_id: parentId,
      event_type: eventInput.event_type,
      severity: eventInput.severity,
      description: eventInput.description,
   };

   const result = await eventRepository.insert(event);
   if (result.error) {
      throw new Error(result.error.message);
   }
   return result.data;
}

module.exports = {
   getEvents: getEvents,
   resolveEvent: resolveEvent,
   createEvent: createEvent,
};
