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

module.exports = {
   savePushToken: savePushToken,
};
