// FILE: src/services/storageService.js
// JOB: Save the token and settings safely on the phone.

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const BIOMETRIC_KEY = "biometric_enabled";

// ---- Token ----

export async function saveToken(token) {
   await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
   const token = await SecureStore.getItemAsync(TOKEN_KEY);
   return token;
}

export async function deleteToken() {
   await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ---- Biometric setting ----

// Save whether the lock is on. We store the text "yes" or "no".
export async function setBiometricEnabled(enabled) {
   const value = enabled ? "yes" : "no";
   await SecureStore.setItemAsync(BIOMETRIC_KEY, value);
}

// Read whether the lock is on. Returns true or false.
export async function isBiometricEnabled() {
   const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
   // If nothing is saved yet, the lock is off by default.
   return value === "yes";
}
