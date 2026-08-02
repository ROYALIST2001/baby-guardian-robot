// FILE: src/routes/authRoutes.js
// JOB: Connect the login and signup URLs to the controller.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login); // POST /v1/auth/login
router.post("/signup", authController.signup); // POST /v1/auth/signup

module.exports = router;
