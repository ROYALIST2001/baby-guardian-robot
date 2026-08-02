// FILE: src/screens/HealthScreen.js
// JOB: Show whether the app can reach the backend.

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { checkHealth } from "../services/apiService";

export default function HealthScreen() {
   // State: the message we show on screen.
   // It starts as "Checking..." and changes when the answer arrives.
   const [message, setMessage] = useState("Checking connection...");

   // useEffect runs once when this screen first opens.
   // The empty list [] at the end means "run only once".
   useEffect(function () {
      // We write a small function so we can use await inside.
      async function loadHealth() {
         const result = await checkHealth();

         if (result === null) {
            // The call failed.
            setMessage("Could not reach the backend. Check the IP address.");
         } else {
            // The call worked. Show what the backend said.
            setMessage("Connected. Backend says: " + result.status);
         }
      }

      loadHealth();
   }, []);

   // What to show on the screen.
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Baby Guardian</Text>
         <Text style={styles.message}>{message}</Text>
      </View>
   );
}

// Styles. This is like CSS, but written as a JavaScript object.
const styles = StyleSheet.create({
   container: {
      flex: 1, // fill the whole screen
      justifyContent: "center", // center up and down
      alignItems: "center", // center left and right
      backgroundColor: "#ffffff",
      padding: 20,
   },
   title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
   },
   message: {
      fontSize: 16,
      textAlign: "center",
   },
});
