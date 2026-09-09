// FILE: src/services/aiClient.js
// JOB: Send audio and images to the Python AI backend, and get the answer.

const axios = require("axios");
const FormData = require("form-data");
const { captureError } = require("./../config/sentry");

const PYTHON_URL = "http://python-backend:8000";

// ---- Ask the AI: is this audio a baby crying? ----
async function detectCry(babyId, audioBytes) {
   try {
      const form = new FormData();
      form.append("baby_id", babyId);
      form.append("file", audioBytes, { filename: "audio.mp3" });

      const response = await axios.post(PYTHON_URL + "/detect-cry", form, {
         headers: form.getHeaders(),
         timeout: 30000,
      });

      return response.data; // { is_crying, label, score }
   } catch (error) {
      // Report it, but keep running. The system continues without AI.
      captureError(error, {
         service: "aiClient",
         check: "cry",
         baby_id: babyId,
      });
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
      captureError(error, {
         service: "aiClient",
         check: "baby",
         baby_id: babyId,
      });
      return null;
   }
}

// ---- NEW: ask the AI: does the face look distressed? ----
async function detectEmotion(babyId, imageBytes) {
   try {
      const form = new FormData();
      form.append("baby_id", babyId);
      form.append("file", imageBytes, { filename: "image.jpg" });

      const response = await axios.post(PYTHON_URL + "/detect-emotion", form, {
         headers: form.getHeaders(),
         timeout: 30000,
      });

      return response.data; // { distressed, emotion, score }
   } catch (error) {
      captureError(error, {
         service: "aiClient",
         check: "emotion",
         baby_id: babyId,
      });
      return null;
   }
}

module.exports = {
   detectCry: detectCry,
   detectBaby: detectBaby,
   detectEmotion: detectEmotion,
};
