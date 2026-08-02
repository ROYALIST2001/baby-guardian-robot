// FILE: src/services/commandService.js
// JOB: Send commands to the robot over MQTT.

const mqttClient = require("../config/mqtt");

const COMMAND_TOPIC = "babyguardian/commands";

// The only directions we accept. Anything else is refused.
const ALLOWED_DIRECTIONS = ["forward", "backward", "left", "right", "stop"];

// ---- Send a movement command ----
function sendMove(direction) {
   // Rule: the direction must be one we allow.
   // This stops bad or dangerous values reaching the robot.
   if (!ALLOWED_DIRECTIONS.includes(direction)) {
      throw new Error("Direction must be one of: " + ALLOWED_DIRECTIONS.join(", "));
   }

   const command = { command: "move", direction: direction };

   // Publish it to the topic the robot listens to.
   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);

   return command;
}

// ---- Send a music command ----
function sendMusic(action, track) {
   // Rule: only play or stop.
   if (action !== "play" && action !== "stop") {
      throw new Error("Action must be 'play' or 'stop'");
   }

   const command = { command: "music", action: action, track: track };

   mqttClient.publish(COMMAND_TOPIC, JSON.stringify(command), { qos: 1 });
   console.log("COMMAND sent:", command);

   return command;
}

module.exports = {
   sendMove: sendMove,
   sendMusic: sendMusic,
};
