// FILE: src/routes/readingRoutes.js
// JOB: Connect each URL and method to a controller function.

const express = require("express");
const router = express.Router();
const readingController = require("../controllers/readingController");

router.get("/", readingController.getAll); // GET  /v1/sensor-readings
router.post("/", readingController.create); // POST /v1/sensor-readings

module.exports = router;
