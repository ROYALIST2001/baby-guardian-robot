// FILE: src/services/outcomeTracker.js
// JOB: After a lullaby plays, wait and see if the baby cried again.
//      If not, tell the brain that lullaby worked.

const axios = require("axios");

const PYTHON_URL = "http://python-backend:8000";

// How long to wait before deciding. 2 minutes.
const WAIT_MS = 2 * 60 * 1000;

// Lullabies we are currently watching.
// The key is the baby id. The value is what we are waiting on.
const watching = {};

// ---- Called when a lullaby starts playing ----
function lullabyPlayed(babyId, parentId, track) {
   // If we were already watching this baby, cancel the old timer.
   if (watching[babyId]) {
      clearTimeout(watching[babyId].timer);
   }

   console.log("TRACKER: watching", track, "for 2 minutes...");

   // Start a timer. If nothing cancels it, the lullaby worked.
   const timer = setTimeout(async function () {
      console.log("TRACKER:", track, "seems to have worked. No crying returned.");

      try {
         // Tell the brain, so it remembers.
         await axios.post(PYTHON_URL + "/lullaby-worked", {
            baby_id: babyId,
            parent_id: parentId,
            track: track,
         });
      } catch (error) {
         console.log("TRACKER: could not report success:", error.message);
      }

      // Stop watching.
      delete watching[babyId];
   }, WAIT_MS);

   // Remember what we are watching.
   watching[babyId] = { track: track, timer: timer };
}

// ---- Called when new crying arrives ----
function cryingReturned(babyId) {
   // If we were not watching, there is nothing to cancel.
   if (!watching[babyId]) {
      return;
   }

   console.log("TRACKER:", watching[babyId].track, "did not work. Crying returned.");

   // Cancel the timer, so we never mark it as working.
   clearTimeout(watching[babyId].timer);
   delete watching[babyId];
}

module.exports = {
   lullabyPlayed: lullabyPlayed,
   cryingReturned: cryingReturned,
};
