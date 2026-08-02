// FILE: App.js
// JOB: Check if we are logged in, then show the right screens.

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { getToken } from "./src/services/storageService";

// Create the stack (the pile of screens).
const Stack = createNativeStackNavigator();

export default function App() {
   // Are we still checking for a saved token?
   const [loading, setLoading] = useState(true);

   // Are we logged in?
   const [loggedIn, setLoggedIn] = useState(false);

   // Runs once when the app opens.
   useEffect(function () {
      async function checkLogin() {
         // Look for a saved token on the phone.
         const token = await getToken();

         // If a token exists, we are logged in.
         if (token) {
            setLoggedIn(true);
         }

         setLoading(false);
      }

      checkLogin();
   }, []);

   // While checking, show a simple message.
   if (loading) {
      return (
         <View style={styles.center}>
            <Text>Loading...</Text>
         </View>
      );
   }

   return (
      <NavigationContainer>
         <Stack.Navigator>
            {loggedIn ? (
               // ---- Logged in: show the home screen ----
               <Stack.Screen name="Home" options={{ title: "Baby Guardian" }}>
                  {(props) => (
                     <HomeScreen {...props} onLogout={() => setLoggedIn(false)} />
                  )}
               </Stack.Screen>
            ) : (
               // ---- Not logged in: show login and signup ----
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
