// FILE: src/services/pushService.js
// JOB: Ask the phone for permission, and get this phone's push token.

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Tell the app how to behave when a notification arrives
// while the app is OPEN. Without this, nothing shows.
Notifications.setNotificationHandler({
   handleNotification: async function () {
      return {
         shouldShowAlert: true, // show the banner
         shouldPlaySound: true, // play the sound
         shouldSetBadge: false, // no number on the app icon
      };
   },
});

// Ask for permission and get the token.
// Returns the token, or null if we cannot get one.
export async function registerForPush() {
   // Step 1: push does not work on simulators. Only real phones.
   if (!Device.isDevice) {
      console.log("Push: this is not a real device. Skipping.");
      return null;
   }

   // Step 2: check if we already have permission.
   const existing = await Notifications.getPermissionsAsync();
   let status = existing.status;

   // Step 3: if not, ask the parent now.
   if (status !== "granted") {
      const asked = await Notifications.requestPermissionsAsync();
      status = asked.status;
   }

   // Step 4: if the parent refused, stop. Do not break the app.
   if (status !== "granted") {
      console.log("Push: permission was refused.");
      return null;
   }

   // Step 5: Android needs a notification channel, or nothing shows.
   if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
         name: "default",
         importance: Notifications.AndroidImportance.MAX,
      });
   }

   // Step 6: get this phone's token from Expo.
   try {
      const tokenResult = await Notifications.getExpoPushTokenAsync();
      console.log("Push token:", tokenResult.data);
      return tokenResult.data;
   } catch (error) {
      console.log("Push: could not get a token:", error.message);
      return null;
   }
}
