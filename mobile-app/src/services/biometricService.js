// FILE: src/services/biometricService.js
// JOB: Talk to the phone's fingerprint or face system.

import * as LocalAuthentication from "expo-local-authentication";

// Check if this phone can use biometrics at all.
// Returns true only if the hardware exists AND something is set up.
export async function isBiometricAvailable() {
   // Step 1: does the phone have the hardware?
   const hasHardware = await LocalAuthentication.hasHardwareAsync();
   if (!hasHardware) {
      return false;
   }

   // Step 2: has the user set up a fingerprint or face on the phone?
   const isEnrolled = await LocalAuthentication.isEnrolledAsync();
   if (!isEnrolled) {
      return false;
   }

   return true;
}

// Ask the phone to check the person. Returns true if it passed.
export async function runBiometricCheck() {
   const result = await LocalAuthentication.authenticateAsync({
      // The message shown on the phone's own prompt.
      promptMessage: "Unlock Baby Guardian",
      // The text on the fallback button.
      cancelLabel: "Cancel",
      // Do not offer the phone passcode. Keep it simple.
      disableDeviceFallback: true,
   });

   // The result has a "success" field: true or false.
   return result.success;
}
