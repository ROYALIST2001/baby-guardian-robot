// FILE: src/screens/LockScreen.js
// JOB: Shown when the app is locked. Lets the parent try again.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// "onUnlock" is a function given by App.js. It runs the check again.
export default function LockScreen({ onUnlock }) {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Baby Guardian</Text>
         <Text style={styles.text}>The app is locked.</Text>

         <TouchableOpacity style={styles.button} onPress={onUnlock}>
            <Text style={styles.buttonText}>Unlock</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
      padding: 24,
   },
   title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
   text: { fontSize: 15, color: "#666666", marginBottom: 30 },
   button: {
      backgroundColor: "#4a90d9",
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 8,
   },
   buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
