// FILE: src/services/commandService.js
// JOB: Send commands to the robot over MQTT.

const mqttClient = require("../config/mqtt");

const COMMAND_TOPIC = "babyguardian/commands";

const ALLOWED_DIRECTIONS = ["forward", "backward", "left", "right", "stop"];
const ALLOWED_CAMERA_MOVES = ["up", "down", "left", "right", "center"];

// ---- Send a movement command ----
function sendMove(direction) {
   if (!ALLOWED_DIRECTIONS.includes(direction)) {
      throw new Error("Direction must be one of: " + ALLOWED_DIRECTIONS.join(", "));
   }

   const command = { command: "move", direction: direction };
   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);
   return command;
}

// ---- Send a music command ----
function sendMusic(action, track) {
   if (action !== "play" && action !== "stop") {
      throw new Error("Action must be 'play' or 'stop'");
   }

   const command = { command: "music", action: action, track: track };
   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);
   return command;
}

// ---- Send a camera command ----
function sendCamera(move) {
   if (!ALLOWED_CAMERA_MOVES.includes(move)) {
      throw new Error("Camera move must be one of: " + ALLOWED_CAMERA_MOVES.join(", "));
   }

   const command = { command: "camera", move: move };
   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);
   return command;
}

// ---- NEW: sound the emergency alarm ----
function sendAlarm(action) {
   if (action !== "on" && action !== "off") {
      throw new Error("Alarm action must be 'on' or 'off'");
   }

   const command = { command: "alarm", action: action };
   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);
   return command;
}

module.exports = {
   sendMove: sendMove,
   sendMusic: sendMusic,
   sendCamera: sendCamera,
   sendAlarm: sendAlarm,
};
