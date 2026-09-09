// FILE: src/controllers/healthController.js
// JOB: Return the health report with the right status code.

const healthService = require("../services/healthService");

// GET /health
// The simple, fast check. Only proves the web server is answering.
function simple(req, res) {
   res.json({ status: "ok", service: "node-backend" });
}

// GET /health/deep
// The real check. Tests every connection.
async function deep(req, res) {
   try {
      const report = await healthService.checkAll();

      // The status CODE matters more than the words,
      // because monitoring tools watch the code.
      // 200 = healthy or degraded. 503 = service unavailable.
      const code = report.status === "down" ? 503 : 200;

      res.status(code).json(report);
   } catch (error) {
      // If the health check itself breaks, say so clearly.
      res.status(503).json({
         status: "down",
         error: "The health check itself failed: " + error.message,
      });
   }
}

module.exports = {
   simple: simple,
   deep: deep,
};
