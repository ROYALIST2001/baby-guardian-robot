// FILE: src/routes/modeRoutes.js
// JOB: Connect the mode URLs to the controller.

const express = require("express");
const router = express.Router();
const modeController = require("../controllers/modeController");

router.get("/", modeController.getMode); // GET /v1/mode
router.put("/", modeController.setMode); // PUT /v1/mode

module.exports = router;
