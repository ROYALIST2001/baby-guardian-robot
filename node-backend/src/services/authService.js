// FILE: src/services/authService.js
// JOB: The login logic. Ask Supabase to check email and password.

const supabase = require("../config/supabase");

// Try to log in with email and password.
async function login(email, password) {
   // Rule: both fields are required.
   if (!email || !password) {
      throw new Error("email and password are required");
   }

   // Ask Supabase to check the email and password.
   const result = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
   });

   // Wrong email or password.
   if (result.error) {
      throw new Error("Wrong email or password");
   }

   // Success. Return the token and basic user info.
   return {
      token: result.data.session.access_token,
      user: {
         id: result.data.user.id,
         email: result.data.user.email,
      },
   };
}

module.exports = {
   login: login,
};
