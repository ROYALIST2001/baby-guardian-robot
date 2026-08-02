// FILE: src/services/authService.js
// JOB: Login and signup logic.

const supabase = require("../config/supabase");
const profileRepository = require("../repositories/profileRepository");

// ---- LOGIN: check email and password, return a token ----
async function login(email, password) {
   if (!email || !password) {
      throw new Error("email and password are required");
   }

   const result = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
   });

   if (result.error) {
      throw new Error("Wrong email or password");
   }

   return {
      token: result.data.session.access_token,
      user: {
         id: result.data.user.id,
         email: result.data.user.email,
      },
   };
}

// ---- SIGNUP: create a new parent account ----
async function signup(email, password, fullName, phone) {
   // Rule: email and password are required.
   if (!email || !password) {
      throw new Error("email and password are required");
   }

   // Rule: Supabase needs a password of at least 6 characters.
   if (password.length < 6) {
      throw new Error("password must be at least 6 characters");
   }

   // Step 1: ask Supabase to create the user.
   const result = await supabase.auth.signUp({
      email: email,
      password: password,
   });

   if (result.error) {
      throw new Error(result.error.message);
   }

   const newUser = result.data.user;
   if (!newUser) {
      throw new Error("Could not create the account");
   }

   // Step 2: create the profile row for the extra details.
   // The profile id must match the auth user id.
   const profileResult = await profileRepository.insert({
      id: newUser.id,
      full_name: fullName,
      phone: phone,
   });

   // If the profile failed, we log it but do not stop.
   // The account already exists, so failing here would confuse the user.
   if (profileResult.error) {
      console.log("Signup: could not create profile:", profileResult.error.message);
   }

   // Step 3: return the token.
   // If email confirmation is ON in Supabase, there is no session yet.
   if (!result.data.session) {
      return {
         token: null,
         user: { id: newUser.id, email: newUser.email },
         message: "Account created. Please confirm your email before logging in.",
      };
   }

   return {
      token: result.data.session.access_token,
      user: { id: newUser.id, email: newUser.email },
   };
}

module.exports = {
   login: login,
   signup: signup,
};
