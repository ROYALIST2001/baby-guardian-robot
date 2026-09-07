// FILE: src/routes/profileRoutes.js
// JOB: Connect the profile URLs to the controller.

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.put("/push-token", profileController.savePushToken);
router.get("/quiet-hours", profileController.getQuietHours);
router.put("/quiet-hours", profileController.saveQuietHours);

module.exports = router;
