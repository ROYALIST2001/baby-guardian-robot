// FILE: src/controllers/commandController.js
// JOB: Read the request, call the command service, send the response.

const commandService = require("../services/commandService");

// POST /v1/commands/move
function move(req, res) {
   try {
      const direction = req.body.direction;
      const command = commandService.sendMove(direction);
      res.json({ sent: true, command: command });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// POST /v1/commands/music
function music(req, res) {
   try {
      const action = req.body.action;
      const track = req.body.track;
      const command = commandService.sendMusic(action, track);
      res.json({ sent: true, command: command });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {
   move: move,
   music: music,
};
