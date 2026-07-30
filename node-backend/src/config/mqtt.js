// FILE: src/config/mqtt.js
// JOB: Create the MQTT connection once and share it.

const mqtt = require("mqtt");

// Build the secure address of the broker.
// "mqtts" means MQTT with encryption. The "s" is for secure.
// Example: mqtts://abc123.s1.eu.hivemq.cloud:8883
const brokerAddress = "mqtts://" + process.env.MQTT_HOST + ":" + process.env.MQTT_PORT;

// Connect to the broker using our username and password.
const mqttClient = mqtt.connect(brokerAddress, {
   username: process.env.MQTT_USERNAME,
   password: process.env.MQTT_PASSWORD,
});

// Share this connection so other files can use it.
module.exports = mqttClient;
