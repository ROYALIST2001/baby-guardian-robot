// FILE: src/screens/HomeScreen.js
// JOB: The screen shown after logging in. Simple for now.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { deleteToken } from "../services/storageService";

export default function HomeScreen({ onLogout }) {
   // Runs when Log Out is tapped.
   async function handleLogout() {
      // Delete the saved token.
      await deleteToken();
      // Tell App.js we are logged out.
      onLogout();
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>You are logged in</Text>
         <Text style={styles.text}>The dashboard comes in the next part.</Text>

         <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
   title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
   text: { fontSize: 14, color: "#666666", marginBottom: 24, textAlign: "center" },
   button: {
      backgroundColor: "#cc4444",
      padding: 14,
      borderRadius: 8,
      paddingHorizontal: 32,
   },
   buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
