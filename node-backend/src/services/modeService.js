// FILE: src/services/modeService.js
// JOB: Remember the robot mode and announce changes.

const redisClient = require("../config/redis");
const mqttClient = require("../config/mqtt");
const socket = require("../config/socket");

// The key we store the mode under in Redis.
const MODE_KEY = "robot_mode";

// The topic the robot listens to.
const COMMAND_TOPIC = "babyguardian/commands";

// ---- Read the current mode ----
async function getMode() {
   const mode = await redisClient.get(MODE_KEY);

   // If nothing is saved yet (first ever run), default to manual.
   // Manual is the safest default, because nothing moves without a human.
   if (!mode) {
      return "manual";
   }
   return mode;
}

// ---- Change the mode ----
async function setMode(newMode, reason) {
   // Rule: only two modes exist.
   if (newMode !== "manual" && newMode !== "auto") {
      throw new Error("Mode must be 'manual' or 'auto'");
   }

   // Step 1: save it in Redis, so it survives a restart.
   await redisClient.set(MODE_KEY, newMode);
   console.log("MODE: changed to", newMode, "-", reason);

   // Step 2: tell every connected app, live.
   const io = socket.getIo();
   if (io) {
      io.emit("mode_change", { mode: newMode, reason: reason });
   }

   // Step 3: tell the robot over MQTT.
   const message = JSON.stringify({ command: "set_mode", mode: newMode });
   mqttClient.publish(COMMAND_TOPIC, message, { qos: 1 });

   return newMode;
}

module.exports = {
   getMode: getMode,
   setMode: setMode,
};
