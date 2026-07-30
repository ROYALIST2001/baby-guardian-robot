// FILE: server.js
// JOB: Start the server and connect all the pieces.

const express = require("express");
const logger = require("./src/middleware/logger");
const babyRoutes = require("./src/routes/babyRoutes");

const app = express();
const PORT = 3000;

// Step 1: allow the server to read JSON bodies (needed for POST and PUT).
app.use(express.json());

// Step 2: log every request.
app.use(logger);

// Step 3: a simple health check to confirm the server is alive.
app.get("/health", function (req, res) {
   res.json({ status: "ok", service: "node-backend" });
});

// Step 4: connect the baby routes.
// Any URL that starts with /v1/babies goes to babyRoutes.
// Nginx removes the /api/ part, so in the browser you use /api/v1/babies.
app.use("/v1/babies", babyRoutes);

// Step 5: start listening for requests.
app.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
