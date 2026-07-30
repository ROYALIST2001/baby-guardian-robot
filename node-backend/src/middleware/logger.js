// FILE: src/middleware/logger.js
// JOB: Print every incoming request.

function logger(req, res, next) {
   const time = new Date().toISOString();
   console.log("[" + time + "] " + req.method + " " + req.originalUrl);
   next(); // pass the request to the next step
}

module.exports = logger;
