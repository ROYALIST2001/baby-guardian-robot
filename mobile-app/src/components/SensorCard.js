// FILE: src/components/SensorCard.js
// JOB: Show one sensor's latest value.
// It receives "reading" as a prop from the screen.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SensorCard({ reading }) {
   // Make the sensor name look nicer, for example "temperature" -> "Temperature".
   const name =
      reading.sensor_type.charAt(0).toUpperCase() + reading.sensor_type.slice(1);

   return (
      <View style={styles.card}>
         <Text style={styles.name}>{name}</Text>
         <Text style={styles.value}>
            {reading.value} {reading.unit}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: "#f4f6f8",
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      width: "48%", // two cards fit side by side
   },
   name: { fontSize: 13, color: "#666666", marginBottom: 4 },
   value: { fontSize: 20, fontWeight: "bold" },
});
