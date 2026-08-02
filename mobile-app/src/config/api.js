// FILE: src/config/api.js
// JOB: Hold the backend address in one place.

// Your phone and computer must be on the same WiFi.
//
// Example: "http://192.168.1.5"
export const API_BASE_URL = "http://10.150.205.132";
// The full address for the Node backend API.
// Nginx sends anything starting with /api/ to the Node backend.
export const NODE_API_URL = API_BASE_URL + "/api";

// The full address for the Python AI backend.
export const AI_API_URL = API_BASE_URL + "/ai";
