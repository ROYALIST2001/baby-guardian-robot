// FILE: src/components/EventItem.js
// JOB: Show one event. The color depends on the severity.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventItem({ event }) {
   // Pick a color for the severity.
   let color = "#888888"; // grey for info
   if (event.severity === "warning") {
      color = "#e0a800"; // yellow for warning
   }
   if (event.severity === "emergency") {
      color = "#cc0000"; // red for emergency
   }

   return (
      <View style={styles.row}>
         {/* A small colored bar on the left. */}
         <View style={[styles.bar, { backgroundColor: color }]} />

         <View style={styles.textArea}>
            <Text style={styles.type}>{event.event_type}</Text>
            <Text style={styles.severity}>{event.severity}</Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row", // put items side by side
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "#eeeeee",
   },
   bar: { width: 5, height: 34, borderRadius: 3, marginRight: 12 },
   textArea: { flex: 1 },
   type: { fontSize: 15, fontWeight: "bold" },
   severity: { fontSize: 12, color: "#777777", marginTop: 2 },
});
