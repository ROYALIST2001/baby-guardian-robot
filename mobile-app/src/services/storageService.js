// FILE: src/services/storageService.js
// JOB: Save the token safely on the phone.

import * as SecureStore from "expo-secure-store";

// The name we store the token under.
const TOKEN_KEY = "auth_token";

// Save the token.
export async function saveToken(token) {
   await SecureStore.setItemAsync(TOKEN_KEY, token);
}

// Read the token. Returns the token, or null if there is none.
export async function getToken() {
   const token = await SecureStore.getItemAsync(TOKEN_KEY);
   return token;
}

// Delete the token (used when logging out).
export async function deleteToken() {
   await SecureStore.deleteItemAsync(TOKEN_KEY);
}
