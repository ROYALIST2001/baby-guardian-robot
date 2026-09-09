// FILE: src/middleware/errorHandler.js
// JOB: Catch any error that reaches Express, report it,
//      and send the caller a clean message.

const { captureError } = require("../config/sentry");

// An error handling middleware has FOUR parameters, not three.
// Express uses the number of parameters to know what this is.
// That fourth one, "next", must be there even if unused.
function errorHandler(error, req, res, next) {
   // Report it with useful context about the request.
   captureError(error, {
      service: "express",
      method: req.method,
      path: req.originalUrl,
      // The user id is safe. We never send the token or the email.
      user_id: req.user ? req.user.id : null,
   });

   // Send the caller a clean message.
   // We do NOT send the full technical details, because that could
   // reveal how the system works to an attacker.
   res.status(500).json({
      error: "Something went wrong on our side. Please try again.",
   });
}

module.exports = errorHandler;
