// FILE: server.js
// JOB: Start the server with Socket.IO, connect routes, and start MQTT.

const express = require("express");
const http = require("http"); // new: the raw web server
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const logger = require("./src/middleware/logger");
const authGuard = require("./src/middleware/authGuard");
const socket = require("./src/config/socket"); // new
const mqttListener = require("./src/mqtt/mqttListener");

const authRoutes = require("./src/routes/authRoutes");
const babyRoutes = require("./src/routes/babyRoutes");
const readingRoutes = require("./src/routes/readingRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

const app = express();
const PORT = 3000;

// ---- These run on every request ----
//app.use(helmet());
// Use Helmet for safety headers, but turn OFF the Content Security Policy.
// The CSP was blocking our simple test page scripts.
// All other Helmet protections stay on.
app.use(
   helmet({
      contentSecurityPolicy: false,
   }),
);
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

// ---- A small test page to SEE live updates ----
// Open this in a browser: http://localhost/api/socket-test
app.get("/socket-test", function (req, res) {
   res.send(`
    <html>
      <body>
        <h2>Live updates test</h2>
        <div id="log">Connecting...</div>
        <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
        <script>
          var log = document.getElementById("log");
          var socket = io(); // connect to this same server
          socket.on("connect", function () {
            log.innerHTML = "Connected. Waiting for data...<br>";
          });
          socket.on("sensor_reading", function (d) {
            log.innerHTML += "READING: " + d.sensor_type + " = " + d.value + "<br>";
          });
          socket.on("event", function (d) {
            log.innerHTML += "<b>EVENT: " + d.event_type + " (" + d.severity + ")</b><br>";
          });
        </script>
      </body>
    </html>
  `);
});

// ---- Protected routes ----
app.use("/v1/babies", generalLimit, authGuard, babyRoutes);
app.use("/v1/sensor-readings", generalLimit, authGuard, readingRoutes);
app.use("/v1/events", generalLimit, authGuard, eventRoutes);

// ---- Start the server the NEW way ----

// Step 1: wrap Express inside a raw HTTP server.
const httpServer = http.createServer(app);

// Step 2: attach Socket.IO to that raw server.
socket.init(httpServer);

// Step 3: start MQTT (it can now emit through Socket.IO).
mqttListener.start();

// Step 4: start the raw server (this replaces app.listen).
httpServer.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
