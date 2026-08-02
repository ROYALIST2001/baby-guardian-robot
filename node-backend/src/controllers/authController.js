// FILE: src/controllers/authController.js
// JOB: Read login and signup requests, call the service, send the response.

const authService = require("../services/authService");

// POST /v1/auth/login
async function login(req, res) {
   try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await authService.login(email, password);
      res.json(result);
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
}

// POST /v1/auth/signup
async function signup(req, res) {
   try {
      const email = req.body.email;
      const password = req.body.password;
      const fullName = req.body.full_name;
      const phone = req.body.phone;

      const result = await authService.signup(email, password, fullName, phone);
      res.status(201).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   login: login,
   signup: signup,
};
