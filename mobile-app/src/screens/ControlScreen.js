// FILE: src/screens/ControlScreen.js
// JOB: Control the robot. Mode switch, joystick, and music.

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import { getMode, setMode, move, playMusic, stopMusic } from "../services/controlService";
import { connectSocket } from "../services/socketService";
import Joystick from "../components/Joystick";

export default function ControlScreen() {
   // The current mode: "manual" or "auto".
   const [mode, setModeState] = useState("manual");

   // A short message showing the last thing we sent.
   const [lastAction, setLastAction] = useState("Nothing sent yet");

   // An error message, if something fails.
   const [error, setError] = useState("");

   // Runs once when the screen opens.
   useEffect(function () {
      // Step 1: load the current mode from the backend.
      async function loadMode() {
         try {
            const result = await getMode();
            setModeState(result.mode);
         } catch (e) {
            setError(e.message);
         }
      }

      loadMode();

      // Step 2: listen for mode changes from the server.
      // This is how the app sees the emergency auto-switch.
      const socket = connectSocket();
      socket.on("mode_change", function (data) {
         setModeState(data.mode);
         setLastAction("Mode changed to " + data.mode + " (" + data.reason + ")");
      });

      // Note: we do not disconnect here, because the dashboard also uses
      // this socket. It closes when you log out.
   }, []);

   // Switch between manual and auto.
   async function handleModeSwitch() {
      setError("");
      const newMode = mode === "manual" ? "auto" : "manual";

      try {
         const result = await setMode(newMode);
         setModeState(result.mode);
         setLastAction("Mode set to " + result.mode);
      } catch (e) {
         setError(e.message);
      }
   }

   // Runs when a joystick button is tapped.
   async function handleMove(direction) {
      setError("");
      try {
         await move(direction);
         setLastAction("Move: " + direction);
      } catch (e) {
         setError(e.message);
      }
   }

   // Play a lullaby.
   async function handlePlay(track) {
      setError("");
      try {
         await playMusic(track);
         setLastAction("Playing: " + track);
      } catch (e) {
         setError(e.message);
      }
   }

   // Stop the music.
   async function handleStop() {
      setError("");
      try {
         await stopMusic();
         setLastAction("Music stopped");
      } catch (e) {
         setError(e.message);
      }
   }

   // In auto mode the AI drives, so we disable the joystick.
   const drivingDisabled = mode === "auto";

   return (
      <ScrollView style={styles.page}>
         {/* Mode section */}
         <Text style={styles.sectionTitle}>Mode</Text>
         <View style={styles.modeBox}>
            <Text style={styles.modeText}>
               {mode === "manual" ? "Manual (you drive)" : "Auto (AI drives)"}
            </Text>
            <TouchableOpacity style={styles.modeButton} onPress={handleModeSwitch}>
               <Text style={styles.modeButtonText}>
                  Switch to {mode === "manual" ? "Auto" : "Manual"}
               </Text>
            </TouchableOpacity>
         </View>

         {/* Joystick section */}
         <Text style={styles.sectionTitle}>Drive</Text>
         {drivingDisabled ? (
            <Text style={styles.note}>
               Driving is off in auto mode. Switch to manual to drive.
            </Text>
         ) : null}
         <Joystick onMove={handleMove} disabled={drivingDisabled} />

         {/* Music section */}
         <Text style={styles.sectionTitle}>Music</Text>
         <View style={styles.musicRow}>
            <TouchableOpacity
               style={styles.musicButton}
               onPress={() => handlePlay("lullaby1")}
            >
               <Text style={styles.musicText}>Lullaby 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.musicButton}
               onPress={() => handlePlay("lullaby2")}
            >
               <Text style={styles.musicText}>Lullaby 2</Text>
            </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
            <Text style={styles.musicText}>Stop Music</Text>
         </TouchableOpacity>

         {/* Status */}
         <Text style={styles.sectionTitle}>Status</Text>
         <Text style={styles.status}>{lastAction}</Text>
         {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
   sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
   modeBox: {
      backgroundColor: "#f4f6f8",
      borderRadius: 10,
      padding: 14,
      alignItems: "center",
   },
   modeText: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
   modeButton: {
      backgroundColor: "#4a90d9",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
   },
   modeButtonText: { color: "#ffffff", fontWeight: "bold" },
   note: { color: "#888888", fontSize: 13, textAlign: "center" },
   musicRow: { flexDirection: "row", justifyContent: "space-between" },
   musicButton: {
      backgroundColor: "#5a9e5a",
      padding: 14,
      borderRadius: 8,
      width: "48%",
      alignItems: "center",
   },
   stopButton: {
      backgroundColor: "#888888",
      padding: 14,
      borderRadius: 8,
      marginTop: 10,
      alignItems: "center",
   },
   musicText: { color: "#ffffff", fontWeight: "bold" },
   status: { fontSize: 14, color: "#444444", marginBottom: 30 },
   error: { color: "#cc0000", marginBottom: 20 },
});
