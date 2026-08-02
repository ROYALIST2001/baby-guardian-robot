// FILE: src/routes/commandRoutes.js
// JOB: Connect the command URLs to the controller.

const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");

router.post("/move", commandController.move); // POST /v1/commands/move
router.post("/music", commandController.music); // POST /v1/commands/music
router.post("/camera", commandController.camera); // POST /v1/commands/camera

module.exports = router;
