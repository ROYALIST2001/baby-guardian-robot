// FILE: src/routes/babyRoutes.js
// JOB: Connect each URL and method to a controller function.

const express = require("express");
const router = express.Router();
const babyController = require("../controllers/babyController");

// method + path  ->  controller function
router.get("/", babyController.getAll); // GET    /v1/babies
router.get("/:id", babyController.getOne); // GET    /v1/babies/123
router.post("/", babyController.create); // POST   /v1/babies
router.put("/:id", babyController.update); // PUT    /v1/babies/123
router.delete("/:id", babyController.remove); // DELETE /v1/babies/123

module.exports = router;
