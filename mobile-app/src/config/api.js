// FILE: src/config/api.js
// JOB: Hold the addresses in one place.

// Your computer's IP address. Find it with "ipconfig" in PowerShell.
export const API_BASE_URL = "http://10.150.205.132";

// The Node backend API.
export const NODE_API_URL = API_BASE_URL + "/api";

// The Python AI backend.
export const AI_API_URL = API_BASE_URL + "/ai";

// The robot camera address (the ESP32-CAM).
// We do not have the camera yet, so leave this empty for now.
// In the hardware phase, set it to the camera's address,
// for example: "http://192.168.1.50"
export const CAMERA_URL = "";
