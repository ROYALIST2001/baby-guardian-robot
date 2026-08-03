// FILE: src/screens/SettingsScreen.js
// JOB: Let the parent turn the biometric lock on or off.

import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

import { isBiometricEnabled, setBiometricEnabled } from "../services/storageService";
import { isBiometricAvailable, runBiometricCheck } from "../services/biometricService";

export default function SettingsScreen() {
   // Is the lock currently on?
   const [enabled, setEnabled] = useState(false);

   // Can this phone use biometrics at all?
   const [available, setAvailable] = useState(false);

   const [message, setMessage] = useState("");

   // Runs once when the screen opens.
   useEffect(function () {
      async function load() {
         // Check if the phone supports biometrics.
         const canUse = await isBiometricAvailable();
         setAvailable(canUse);

         // Read the saved setting.
         const saved = await isBiometricEnabled();
         setEnabled(saved);
      }

      load();
   }, []);

   // Runs when the switch is tapped.
   // Runs when the switch is tapped.
   async function handleToggle(newValue) {
      setMessage("");

      // Turning it OFF: just save it, no check needed.
      if (!newValue) {
         await setBiometricEnabled(false);
         setEnabled(false);
         setMessage("Lock turned off.");
         return;
      }

      // Turning it ON: check first, so we never lock someone out.
      try {
         const passed = await runBiometricCheck();

         if (passed) {
            await setBiometricEnabled(true);
            setEnabled(true);
            setMessage("Lock turned on.");
         } else {
            setMessage(
               "The check did not pass. The lock was not turned on. If no prompt appeared, Expo Go may not support Face ID on this phone.",
            );
         }
      } catch (e) {
         // Show the real error, so we can see what went wrong.
         setMessage("Error: " + e.message);
      }
   }

   return (
      <View style={styles.page}>
         <Text style={styles.sectionTitle}>Security</Text>

         {available ? (
            <View style={styles.row}>
               <View style={styles.textArea}>
                  <Text style={styles.label}>Biometric lock</Text>
                  <Text style={styles.hint}>
                     Ask for a fingerprint or face when the app opens.
                  </Text>
               </View>

               <Switch value={enabled} onValueChange={handleToggle} />
            </View>
         ) : (
            <Text style={styles.hint}>
               This phone has no fingerprint or face set up, so the lock cannot be used.
            </Text>
         )}

         {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
   sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
   row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f4f6f8",
      borderRadius: 10,
      padding: 14,
   },
   textArea: { flex: 1, marginRight: 12 },
   label: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
   hint: { fontSize: 13, color: "#666666" },
   message: { marginTop: 14, fontSize: 14, color: "#444444" },
});
