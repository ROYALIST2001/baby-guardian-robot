// FILE: src/services/aiClient.js
// JOB: Send audio and images to the Python AI backend, and get the answer.

const axios = require("axios");
const FormData = require("form-data");

// The Python backend's address inside Docker.
// "python-backend" is the service name from docker-compose.
const PYTHON_URL = "http://python-backend:8000";

// ---- Ask the AI: is this audio a baby crying? ----
// audioBytes is the raw sound data. babyId is needed for the cache.
async function detectCry(babyId, audioBytes) {
   try {
      // Build a file upload, the same shape the endpoint expects.
      const form = new FormData();
      form.append("baby_id", babyId);
      // The third value is a filename. The AI does not use it, but it is required.
      form.append("file", audioBytes, { filename: "audio.mp3" });

      // Send it and wait for the answer.
      const response = await axios.post(PYTHON_URL + "/detect-cry", form, {
         headers: form.getHeaders(),
         timeout: 30000, // give up after 30 seconds
      });

      return response.data; // { is_crying, label, score }
   } catch (error) {
      console.log("AI cry check failed:", error.message);
      return null;
   }
}

// ---- Ask the AI: is a baby visible in this image? ----
async function detectBaby(babyId, imageBytes) {
   try {
      const form = new FormData();
      form.append("baby_id", babyId);
      form.append("file", imageBytes, { filename: "image.jpg" });

      const response = await axios.post(PYTHON_URL + "/detect-baby", form, {
         headers: form.getHeaders(),
         timeout: 30000,
      });

      return response.data; // { baby_found, count, boxes }
   } catch (error) {
      console.log("AI baby check failed:", error.message);
      return null;
   }
}

module.exports = {
   detectCry: detectCry,
   detectBaby: detectBaby,
};
