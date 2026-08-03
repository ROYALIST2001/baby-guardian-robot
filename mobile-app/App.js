// FILE: App.js
// JOB: Check login and the biometric lock, then show the right screens.

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ControlScreen from "./src/screens/ControlScreen";
import VideoScreen from "./src/screens/VideoScreen";
import EmergencyScreen from "./src/screens/EmergencyScreen";
import SettingsScreen from "./src/screens/SettingsScreen"; // new
import LockScreen from "./src/screens/LockScreen"; // new

import { getToken, isBiometricEnabled } from "./src/services/storageService";
import { runBiometricCheck } from "./src/services/biometricService";

const Stack = createNativeStackNavigator();

export default function App() {
   const [loading, setLoading] = useState(true);
   const [loggedIn, setLoggedIn] = useState(false);

   // Is the app locked right now?
   const [locked, setLocked] = useState(false);

   // Runs once when the app opens.
   useEffect(function () {
      startUp();
   }, []);

   // The startup check, in order.
   async function startUp() {
      // Step 1: is there a saved token?
      const token = await getToken();

      if (!token) {
         // Not logged in. Show login. No lock needed.
         setLoggedIn(false);
         setLoading(false);
         return;
      }

      // Step 2: logged in. Is the lock turned on?
      setLoggedIn(true);
      const lockOn = await isBiometricEnabled();

      if (!lockOn) {
         // The lock is off. Go straight in.
         setLocked(false);
         setLoading(false);
         return;
      }

      // Step 3: the lock is on. Ask the phone to check.
      const passed = await runBiometricCheck();
      setLocked(!passed);
      setLoading(false);
   }

   // Runs when the Unlock button is tapped on the lock screen.
   async function handleUnlock() {
      const passed = await runBiometricCheck();
      if (passed) {
         setLocked(false);
      }
   }

   // While checking, show a simple message.
   if (loading) {
      return (
         <View style={styles.center}>
            <Text>Loading...</Text>
         </View>
      );
   }

   // If logged in but locked, show only the lock screen.
   if (loggedIn && locked) {
      return <LockScreen onUnlock={handleUnlock} />;
   }

   return (
      <NavigationContainer>
         <Stack.Navigator>
            {loggedIn ? (
               <>
                  <Stack.Screen name="Home" options={{ title: "Baby Guardian" }}>
                     {(props) => (
                        <HomeScreen {...props} onLogout={() => setLoggedIn(false)} />
                     )}
                  </Stack.Screen>

                  <Stack.Screen
                     name="Control"
                     component={ControlScreen}
                     options={{ title: "Control Robot" }}
                  />

                  <Stack.Screen
                     name="Video"
                     component={VideoScreen}
                     options={{ title: "Live Video" }}
                  />

                  <Stack.Screen
                     name="Emergency"
                     component={EmergencyScreen}
                     options={{ title: "Emergencies" }}
                  />

                  {/* New settings screen */}
                  <Stack.Screen
                     name="Settings"
                     component={SettingsScreen}
                     options={{ title: "Settings" }}
                  />
               </>
            ) : (
               <>
                  <Stack.Screen name="Login" options={{ headerShown: false }}>
                     {(props) => (
                        <LoginScreen {...props} onLogin={() => setLoggedIn(true)} />
                     )}
                  </Stack.Screen>

                  <Stack.Screen name="Signup" options={{ title: "Sign Up" }}>
                     {(props) => (
                        <SignupScreen {...props} onLogin={() => setLoggedIn(true)} />
                     )}
                  </Stack.Screen>
               </>
            )}
         </Stack.Navigator>
      </NavigationContainer>
   );
}

const styles = StyleSheet.create({
   center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
