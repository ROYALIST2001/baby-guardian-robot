// Bring in the Express library, which helps us build a web server easily.
const express = require("express");

// Create our application. Think of "app" as the server itself.
const app = express();

// The port number this server listens on inside its container.
const PORT = 3000;

// Define a "route". A route is an address the server answers to.
// When someone visits "/health", we send back a small JSON message
// saying the service is OK. This is called a "health check" — a simple
// way to confirm the server is alive.
app.get("/health", (req, res) => {
   res.json({ status: "ok", service: "node-backend" });
});

// Start the server. Once it's running, print a message so we can see it.
app.listen(PORT, () => {
   console.log(`Node backend is running on port ${PORT}`);
});
