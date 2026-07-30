// FILE: src/middleware/authGuard.js
// JOB: Check the login token. If valid, attach the user and continue.
//      If not valid, stop the request with status 401.

const supabase = require("../config/supabase");

async function authGuard(req, res, next) {
   // Step 1: read the Authorization header.
   const header = req.headers.authorization;

   // Step 2: if there is no header, reject.
   if (!header) {
      return res.status(401).json({ error: "No token provided. Please log in." });
   }

   // Step 3: remove the word "Bearer " to get the token only.
   const token = header.replace("Bearer ", "");

   // Step 4: ask Supabase if this token is valid and whose it is.
   const result = await supabase.auth.getUser(token);

   // Step 5: if invalid, reject.
   if (result.error || !result.data.user) {
      return res.status(401).json({ error: "Invalid or expired token." });
   }

   // Step 6: valid token. Save the user on the request.
   // Now every route after this can read req.user.id.
   req.user = result.data.user;

   // Step 7: let the request continue to the route.
   next();
}

module.exports = authGuard;
