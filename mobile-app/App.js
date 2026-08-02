// FILE: App.js
// JOB: Check if we are logged in, then show the right screens.

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ControlScreen from "./src/screens/ControlScreen";
import VideoScreen from "./src/screens/VideoScreen"; // new
import EmergencyScreen from "./src/screens/EmergencyScreen"; // new
import { getToken } from "./src/services/storageService";

const Stack = createNativeStackNavigator();

export default function App() {
   const [loading, setLoading] = useState(true);
   const [loggedIn, setLoggedIn] = useState(false);

   useEffect(function () {
      async function checkLogin() {
         const token = await getToken();
         if (token) {
            setLoggedIn(true);
         }
         setLoading(false);
      }
      checkLogin();
   }, []);

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

                  {/* New screens */}
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
