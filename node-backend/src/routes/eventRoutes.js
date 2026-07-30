// FILE: src/routes/eventRoutes.js
// JOB: Connect each URL and method to a controller function.

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAll); // GET /v1/events
router.put("/:id/resolve", eventController.resolve); // PUT /v1/events/123/resolve

module.exports = router;
