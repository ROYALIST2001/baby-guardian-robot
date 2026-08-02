// FILE: src/services/controlService.js
// JOB: Send control commands to the backend.

import { getWithAuth, postWithAuth, putWithAuth } from "./httpService";

// Read the current mode.
export async function getMode() {
   return await getWithAuth("/v1/mode");
}

// Change the mode ("manual" or "auto").
export async function setMode(mode) {
   return await putWithAuth("/v1/mode", { mode: mode });
}

// Drive the robot.
export async function move(direction) {
   return await postWithAuth("/v1/commands/move", { direction: direction });
}

// Play a lullaby.
export async function playMusic(track) {
   return await postWithAuth("/v1/commands/music", { action: "play", track: track });
}

// Stop the music.
export async function stopMusic() {
   return await postWithAuth("/v1/commands/music", { action: "stop" });
}

// NEW: move the camera. Move is up, down, left, right, or center.
export async function moveCamera(move) {
   return await postWithAuth("/v1/commands/camera", { move: move });
}
