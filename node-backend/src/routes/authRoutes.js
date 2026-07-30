// FILE: src/routes/authRoutes.js
// JOB: Connect the login URL to the auth controller.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login); // POST /v1/auth/login

module.exports = router;
