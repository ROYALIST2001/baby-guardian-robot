// FILE: src/config/sentry.js
// JOB: Start error tracking, IF the key is set.
//      If it is not set, the app still runs normally.

const Sentry = require("@sentry/node");

const DSN = process.env.SENTRY_DSN_NODE;

// Is Sentry usable? Only if the key exists.
const isAvailable = Boolean(DSN);

if (isAvailable) {
   Sentry.init({
      dsn: DSN,
      // A name so we can tell our two backends apart in Sentry.
      serverName: "node-backend",
      // How much detail to collect about slow requests.
      // 0.1 means 10 percent, which is plenty and keeps us in the free tier.
      tracesSampleRate: 0.1,
      // NEVER send private data. This is a baby product.
      // sendDefaultPii false means do not attach user emails, IP addresses,
      // cookies or headers automatically.
      sendDefaultPii: false,
   });
   console.log("Sentry: error tracking is switched on for node-backend");
} else {
   console.log("Sentry: no key set. Errors will only go to the logs.");
}

// ---- Report an error we already caught ----
// context is extra information, like which baby or which event.
function captureError(error, context) {
   // Always log it, so it is visible even without Sentry.
   console.log("ERROR:", error.message, context ? JSON.stringify(context) : "");

   // If Sentry is off, stop here. The app carries on.
   if (!isAvailable) {
      return;
   }

   // Send it with the context attached.
   Sentry.withScope(function (scope) {
      if (context) {
         // Tags are searchable in Sentry. Good for grouping.
         if (context.service) {
            scope.setTag("service", context.service);
         }
         if (context.event_type) {
            scope.setTag("event_type", context.event_type);
         }
         // Extra data is shown on the error page.
         // Only safe ids. No phone numbers, no tokens, no media.
         scope.setExtras(context);
      }
      Sentry.captureException(error);
   });
}

module.exports = {
   Sentry: Sentry,
   isAvailable: isAvailable,
   captureError: captureError,
};
