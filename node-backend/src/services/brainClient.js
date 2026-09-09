// FILE: src/services/brainClient.js
// JOB: Call the Python brain and get its decision.

const axios = require("axios");
const { captureError } = require("./../config/sentry");

// The Python backend's address inside Docker.
// "python-backend" is the service name. Port 8000 is its port.
// We talk directly, not through Nginx.
const PYTHON_BRAIN_URL = "http://python-backend:8000/think";

// Send the event to the brain and return the decision.
async function askBrain(eventData) {
   try {
      // Send the event as JSON to the brain's /think endpoint.
      const response = await axios.post(PYTHON_BRAIN_URL, eventData);

      // The brain returns the full result. Give it back.
      return response.data;
   } catch (error) {
      captureError(error, {
         service: "brainClient",
         event_type: eventData.event_type,
         baby_id: eventData.baby_id,
      });
      return null;
   }
}

module.exports = { askBrain: askBrain };
