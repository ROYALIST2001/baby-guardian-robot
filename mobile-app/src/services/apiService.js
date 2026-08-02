// FILE: src/services/apiService.js
// JOB: Talk to the backend. Screens use these functions.

import { NODE_API_URL } from "../config/api";

// Ask the backend if it is alive.
// This calls GET /api/health on the Node backend.
export async function checkHealth() {
   try {
      // "fetch" sends the request and waits for the answer.
      const response = await fetch(NODE_API_URL + "/health");

      // Turn the answer into a JavaScript object.
      const data = await response.json();

      // Give the data back to whoever called this function.
      return data;
   } catch (error) {
      // If the call failed, log it and return null.
      console.log("Health check failed:", error.message);
      return null;
   }
}
