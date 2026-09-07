// FILE: src/controllers/profileController.js
// JOB: Read the request, call the service, send the response.

const profileService = require("../services/profileService");

// PUT /v1/profile/push-token
async function savePushToken(req, res) {
   try {
      const parentId = req.user.id; // set by the auth guard
      const pushToken = req.body.push_token;

      await profileService.savePushToken(parentId, pushToken);
      res.json({ saved: true });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// GET /v1/profile/quiet-hours
async function getQuietHours(req, res) {
   try {
      const parentId = req.user.id;
      const settings = await profileService.getQuietHours(parentId);
      res.json(settings);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
}

// PUT /v1/profile/quiet-hours
async function saveQuietHours(req, res) {
   try {
      const parentId = req.user.id;
      const enabled = req.body.enabled;
      const startHour = req.body.start_hour;
      const endHour = req.body.end_hour;

      await profileService.saveQuietHours(parentId, enabled, startHour, endHour);
      res.json({ saved: true });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   savePushToken: savePushToken,
   getQuietHours: getQuietHours,
   saveQuietHours: saveQuietHours,
};
