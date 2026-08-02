// FILE: server.js
// JOB: Start the server, connect routes, start MQTT and sockets.

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const logger = require("./src/middleware/logger");
const authGuard = require("./src/middleware/authGuard");
const socket = require("./src/config/socket");
const mqttListener = require("./src/mqtt/mqttListener");

const authRoutes = require("./src/routes/authRoutes");
const babyRoutes = require("./src/routes/babyRoutes");
const readingRoutes = require("./src/routes/readingRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const modeRoutes = require("./src/routes/modeRoutes"); // new
const commandRoutes = require("./src/routes/commandRoutes"); // new

const app = express();
const PORT = 3000;

// ---- These run on every request ----
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

// A higher limit for commands, because a joystick sends many taps.
const commandLimit = rateLimit({
   windowMs: 60 * 1000, // one minute
   max: 120, // up to 120 commands per minute
   message: { error: "Too many commands. Please slow down." },
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
app.use("/v1/mode", generalLimit, authGuard, modeRoutes); // new
app.use("/v1/commands", commandLimit, authGuard, commandRoutes); // new

// ---- Start the server ----
const httpServer = http.createServer(app);
socket.init(httpServer);
mqttListener.start();

httpServer.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
