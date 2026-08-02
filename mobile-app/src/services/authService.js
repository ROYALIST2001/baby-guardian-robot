// FILE: src/services/authService.js
// JOB: Send login and signup requests to the backend.

import { NODE_API_URL } from "../config/api";

// ---- LOGIN ----
export async function login(email, password) {
   const response = await fetch(NODE_API_URL + "/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
   });

   const data = await response.json();

   // If the backend returned an error status, throw a clear message.
   if (!response.ok) {
      throw new Error(data.error || "Login failed");
   }

   return data; // { token, user }
}

// ---- SIGNUP ----
export async function signup(email, password, fullName, phone) {
   const response = await fetch(NODE_API_URL + "/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         email: email,
         password: password,
         full_name: fullName,
         phone: phone,
      }),
   });

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.error || "Signup failed");
   }

   return data; // { token, user } or a message
}
