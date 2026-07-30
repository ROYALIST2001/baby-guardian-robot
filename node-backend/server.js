// FILE: server.js
// JOB: Start the server, apply safety, connect routes, and start MQTT.

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const logger = require("./src/middleware/logger");
const authGuard = require("./src/middleware/authGuard");
const mqttListener = require("./src/mqtt/mqttListener"); // new

const authRoutes = require("./src/routes/authRoutes");
const babyRoutes = require("./src/routes/babyRoutes");
const readingRoutes = require("./src/routes/readingRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

const app = express();
const PORT = 3000;

// ---- These run on every request, in this order ----
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// ---- Rate limits ----
const generalLimit = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: { error: "Too many requests. Please slow down." },
});
const loginLimit = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   message: { error: "Too many login attempts. Try again later." },
});

// ---- Public routes ----
app.get("/health", function (req, res) {
   res.json({ status: "ok", service: "node-backend" });
});
app.use("/v1/auth", loginLimit, authRoutes);

// ---- Protected routes ----
app.use("/v1/babies", generalLimit, authGuard, babyRoutes);
app.use("/v1/sensor-readings", generalLimit, authGuard, readingRoutes);
app.use("/v1/events", generalLimit, authGuard, eventRoutes);

// ---- Start the MQTT listener (new) ----
// This makes the server listen for messages from the robot.
mqttListener.start();

// ---- Start the web server ----
app.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
