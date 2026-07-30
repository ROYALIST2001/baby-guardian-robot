// FILE: src/controllers/authController.js
// JOB: Read the login request, call the auth service, send the response.

const authService = require("../services/authService");

// POST /v1/auth/login
async function login(req, res) {
   try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await authService.login(email, password);
      res.json(result); // sends { token, user }
   } catch (error) {
      // Wrong login details or missing fields.
      res.status(401).json({ error: error.message });
   }
}

module.exports = {
   login: login,
};
