// FILE: server.js
// JOB: Start the server. Apply safety, then login, then protected routes.

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const logger = require("./src/middleware/logger");
const authGuard = require("./src/middleware/authGuard");

const authRoutes = require("./src/routes/authRoutes");
const babyRoutes = require("./src/routes/babyRoutes");
const readingRoutes = require("./src/routes/readingRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

const app = express();
const PORT = 3000;

// ---- These run on EVERY request, in this order ----

// Step 1: safety headers.
app.use(helmet());

// Step 2: allow the app to call us from another origin.
app.use(cors());

// Step 3: read JSON bodies.
app.use(express.json());

// Step 4: log every request.
app.use(logger);

// ---- Rate limits ----

// General limit: 100 requests per 15 minutes per visitor.
const generalLimit = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: { error: "Too many requests. Please slow down." },
});

// Strict limit for login: 10 tries per 15 minutes.
const loginLimit = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   message: { error: "Too many login attempts. Try again later." },
});

// ---- Public routes (no token needed) ----

// Health check.
app.get("/health", function (req, res) {
   res.json({ status: "ok", service: "node-backend" });
});

// Login. Uses the strict limiter.
app.use("/v1/auth", loginLimit, authRoutes);

// ---- Protected routes (token needed) ----
// Order for each request: generalLimit -> authGuard -> the routes.

app.use("/v1/babies", generalLimit, authGuard, babyRoutes);
app.use("/v1/sensor-readings", generalLimit, authGuard, readingRoutes);
app.use("/v1/events", generalLimit, authGuard, eventRoutes);

// Start listening.
app.listen(PORT, function () {
   console.log("Node backend running on port " + PORT);
});
