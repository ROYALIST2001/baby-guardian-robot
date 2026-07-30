// FILE: server.js
// JOB: Start the server and connect all the pieces.

const express = require("express");
const logger = require("./src/middleware/logger");
const babyRoutes = require("./src/routes/babyRoutes");
const readingRoutes = require("./src/routes/readingRoutes"); // new
const eventRoutes = require("./src/routes/eventRoutes"); // new

const app = express();
const PORT = 3000;

// Step 1: allow the server to read JSON bodies.
app.use(express.json());

// Step 2: log every request.
app.use(logger);

// Step 3: health check.
app.get("/health", function (req, res) {
   res.json({ status: "ok", service: "node-backend" });
});

// Step 4: connect all feature routes.
app.use("/v1/babies", babyRoutes);
app.use("/v1/sensor-readings", readingRoutes); // new
app.use("/v1/events", eventRoutes); // new

// Step 5: start listening.
app.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
