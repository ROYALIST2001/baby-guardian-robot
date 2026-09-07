// FILE: src/services/quietHours.js
// JOB: Work out whether right now is inside the parent's quiet hours.
//      Pure logic. No database, no internet. Easy to test.

// ---- Is this hour inside the quiet window? ----
// startHour and endHour are numbers from 0 to 23.
// This handles windows that cross midnight, like 22 to 6.
function isQuietHour(hour, startHour, endHour) {
   // Case 1: a normal window that does NOT cross midnight.
   // Example: 1 to 5. Quiet if the hour is 1, 2, 3 or 4.
   if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
   }

   // Case 2: a window that DOES cross midnight.
   // Example: 22 to 6. Quiet if the hour is 22, 23, 0, 1, 2, 3, 4 or 5.
   // Notice this uses OR, not AND.
   if (startHour > endHour) {
      return hour >= startHour || hour < endHour;
   }

   // Case 3: start and end are the same. That means no quiet time.
   return false;
}

// ---- Should we stay quiet right now? ----
// settings comes from the parent's profile.
function isQuietTime(settings, currentHour) {
   // If quiet hours are off, never stay quiet.
   if (!settings || !settings.quiet_hours_enabled) {
      return false;
   }

   const start = settings.quiet_start;
   const end = settings.quiet_end;

   // If the settings are missing or broken, do not stay quiet.
   // When in doubt, it is safer to alert than to stay silent.
   if (start === null || end === null) {
      return false;
   }

   return isQuietHour(currentHour, start, end);
}

module.exports = {
   isQuietHour: isQuietHour,
   isQuietTime: isQuietTime,
};
