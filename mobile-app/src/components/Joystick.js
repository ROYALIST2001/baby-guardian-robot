// FILE: src/components/Joystick.js
// JOB: Show direction buttons. Calls "onMove" with the direction tapped.
// "onMove" is a prop: a function given to us by the screen.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Joystick({ onMove, disabled }) {
   // A small helper so we do not repeat the button code five times.
   function DirectionButton({ label, direction, style }) {
      return (
         <TouchableOpacity
            style={[styles.button, style, disabled ? styles.disabled : null]}
            onPress={function () {
               onMove(direction);
            }}
            disabled={disabled}
         >
            <Text style={styles.buttonText}>{label}</Text>
         </TouchableOpacity>
      );
   }

   return (
      <View style={styles.pad}>
         {/* Top row: forward */}
         <View style={styles.row}>
            <DirectionButton label="^" direction="forward" />
         </View>

         {/* Middle row: left, stop, right */}
         <View style={styles.row}>
            <DirectionButton label="<" direction="left" />
            <DirectionButton label="STOP" direction="stop" style={styles.stop} />
            <DirectionButton label=">" direction="right" />
         </View>

         {/* Bottom row: backward */}
         <View style={styles.row}>
            <DirectionButton label="v" direction="backward" />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   pad: { alignItems: "center", marginVertical: 12 },
   row: { flexDirection: "row", justifyContent: "center" },
   button: {
      width: 70,
      height: 70,
      backgroundColor: "#4a90d9",
      borderRadius: 10,
      margin: 6,
      justifyContent: "center",
      alignItems: "center",
   },
   stop: { backgroundColor: "#cc4444" },
   disabled: { backgroundColor: "#cccccc" },
   buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});
