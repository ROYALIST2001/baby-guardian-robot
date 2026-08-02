// FILE: src/screens/VideoScreen.js
// JOB: Show the robot camera view and let the parent move the camera.

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import { CAMERA_URL } from "../config/api";
import { moveCamera } from "../services/controlService";

export default function VideoScreen() {
   const [lastAction, setLastAction] = useState("Camera is centered");
   const [error, setError] = useState("");

   // Runs when a camera button is tapped.
   async function handleCamera(move) {
      setError("");
      try {
         await moveCamera(move);
         setLastAction("Camera: " + move);
      } catch (e) {
         setError(e.message);
      }
   }

   // A small helper so we do not repeat the button code.
   function CameraButton({ label, move }) {
      return (
         <TouchableOpacity
            style={styles.camButton}
            onPress={function () {
               handleCamera(move);
            }}
         >
            <Text style={styles.camButtonText}>{label}</Text>
         </TouchableOpacity>
      );
   }

   return (
      <View style={styles.page}>
         {/* The video area */}
         <View style={styles.videoBox}>
            {CAMERA_URL ? (
               // If a camera address is set, show the stream.
               <WebView source={{ uri: CAMERA_URL }} style={styles.webview} />
            ) : (
               // If not set, show a clear placeholder.
               <View style={styles.placeholder}>
                  <Text style={styles.placeholderTitle}>No camera connected</Text>
                  <Text style={styles.placeholderText}>
                     Set CAMERA_URL in src/config/api.js once the robot camera is ready.
                  </Text>
               </View>
            )}
         </View>

         {/* Camera controls */}
         <Text style={styles.sectionTitle}>Camera Controls</Text>

         <View style={styles.row}>
            <CameraButton label="Up" move="up" />
         </View>
         <View style={styles.row}>
            <CameraButton label="Left" move="left" />
            <CameraButton label="Center" move="center" />
            <CameraButton label="Right" move="right" />
         </View>
         <View style={styles.row}>
            <CameraButton label="Down" move="down" />
         </View>

         {/* Status */}
         <Text style={styles.status}>{lastAction}</Text>
         {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
   videoBox: {
      height: 240,
      backgroundColor: "#000000",
      borderRadius: 10,
      overflow: "hidden", // keeps the corners rounded
      marginBottom: 16,
   },
   webview: { flex: 1 },
   placeholder: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
   placeholderTitle: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
   },
   placeholderText: { color: "#aaaaaa", fontSize: 13, textAlign: "center" },
   sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
   row: { flexDirection: "row", justifyContent: "center" },
   camButton: {
      backgroundColor: "#4a90d9",
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 8,
      margin: 5,
      minWidth: 80,
      alignItems: "center",
   },
   camButtonText: { color: "#ffffff", fontWeight: "bold" },
   status: { marginTop: 16, fontSize: 14, color: "#444444" },
   error: { color: "#cc0000", marginTop: 8 },
});
