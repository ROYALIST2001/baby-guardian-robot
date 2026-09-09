// FILE: src/routes/healthRoutes.js
// JOB: Connect the health URLs to the controller.

const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

router.get("/", healthController.simple); // GET /health
router.get("/deep", healthController.deep); // GET /health/deep

module.exports = router;
