// FILE: src/services/dataService.js
// JOB: Get data from the backend. Screens use these functions.

import { getWithAuth } from "./httpService";

// Get all babies that belong to the logged-in parent.
export async function getBabies() {
   return await getWithAuth("/v1/babies");
}

// Get sensor readings. If a babyId is given, get only that baby's readings.
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
