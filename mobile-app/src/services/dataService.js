// FILE: src/services/dataService.js
// JOB: Get and update data on the backend.

import { getWithAuth, putWithAuth } from "./httpService";

// Get all babies for the logged-in parent.
export async function getBabies() {
   return await getWithAuth("/v1/babies");
}

// Get sensor readings, optionally for one baby.
export async function getReadings(babyId) {
   if (babyId) {
      return await getWithAuth("/v1/sensor-readings?baby_id=" + babyId);
   }
   return await getWithAuth("/v1/sensor-readings");
}

// Get the recent events.
export async function getEvents() {
   return await getWithAuth("/v1/events");
}

// NEW: mark one event as handled.
export async function resolveEvent(eventId) {
   return await putWithAuth("/v1/events/" + eventId + "/resolve", {});
}
