// FILE: src/routes/profileRoutes.js
// JOB: Connect the profile URLs to the controller.

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// PUT /v1/profile/push-token
router.put("/push-token", profileController.savePushToken);

module.exports = router;
