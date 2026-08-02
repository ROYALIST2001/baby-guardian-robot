// FILE: src/controllers/modeController.js
// JOB: Read the request, call the mode service, send the response.

const modeService = require("../services/modeService");

// GET /v1/mode
async function getMode(req, res) {
   try {
      const mode = await modeService.getMode();
      res.json({ mode: mode });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// PUT /v1/mode
async function setMode(req, res) {
   try {
      const newMode = req.body.mode;
      const result = await modeService.setMode(newMode, "changed by parent in the app");
      res.json({ mode: result });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   getMode: getMode,
   setMode: setMode,
};
