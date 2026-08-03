// FILE: src/screens/HomeScreen.js
// JOB: The dashboard. Shows sensors and events, and updates live.

import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   ScrollView,
   TouchableOpacity,
   StyleSheet,
   RefreshControl,
} from "react-native";

import { getBabies, getReadings, getEvents } from "../services/dataService";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { deleteToken } from "../services/storageService";
import SensorCard from "../components/SensorCard";
import EventItem from "../components/EventItem";

// Take a list of readings (newest first) and keep only the newest per sensor.
function buildLatestReadings(rows) {
   const latest = {};

   for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // The first time we see a sensor type, it is the newest one.
      if (!latest[row.sensor_type]) {
         latest[row.sensor_type] = row;
      }
   }

   return latest;
}

export default function HomeScreen({ navigation, onLogout }) {
   // The baby we are showing.
   const [baby, setBaby] = useState(null);

   // The latest reading for each sensor, kept as an object.
   const [readings, setReadings] = useState({});

   // The recent events, kept as a list.
   const [events, setEvents] = useState([]);

   // Screen status.
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [live, setLive] = useState(false);

   // Load everything from the backend.
   async function loadData() {
      try {
         setError("");

         // Step 1: get the babies and take the first one.
         const babies = await getBabies();
         if (!babies || babies.length === 0) {
            setError("No baby found. Add a baby first.");
            setLoading(false);
            return null;
         }
         const firstBaby = babies[0];
         setBaby(firstBaby);

         // Step 2: get that baby's readings and build the latest per sensor.
         const rows = await getReadings(firstBaby.id);
         setReadings(buildLatestReadings(rows));

         // Step 3: get the recent events.
         const eventRows = await getEvents();
         setEvents(eventRows);

         setLoading(false);
         return firstBaby;
      } catch (e) {
         setError(e.message);
         setLoading(false);
         return null;
      }
   }

   // Runs once when the screen opens.
   useEffect(function () {
      let socket = null;

      async function start() {
         // First load the data, and find out which baby we are showing.
         const currentBaby = await loadData();
         if (!currentBaby) {
            return;
         }

         // Then open the live connection.
         socket = connectSocket();

         socket.on("connect", function () {
            setLive(true);
         });

         socket.on("disconnect", function () {
            setLive(false);
         });

         // A new sensor reading arrived.
         socket.on("sensor_reading", function (data) {
            // Only accept messages for the baby we are showing.
            if (data.baby_id !== currentBaby.id) {
               return;
            }

            // Replace the value for this sensor type, keeping the others.
            setReadings(function (previous) {
               const updated = { ...previous };
               updated[data.sensor_type] = data;
               return updated;
            });
         });

         // A new event arrived.
         socket.on("event", function (data) {
            if (data.baby_id !== currentBaby.id) {
               return;
            }

            // Put the new event at the front of the list.
            setEvents(function (previous) {
               return [data, ...previous];
            });
         });
      }

      start();

      // Cleanup: this runs when we leave the screen.
      // It closes the connection so nothing is left running.
      return function () {
         disconnectSocket();
      };
   }, []);

   // Runs when the user pulls down to refresh.
   async function handleRefresh() {
      setLoading(true);
      await loadData();
   }

   // Runs when Log Out is tapped.
   async function handleLogout() {
      disconnectSocket();
      await deleteToken();
      onLogout();
   }

   // Turn the readings object into a list we can show.
   const readingList = Object.values(readings);

   return (
      <ScrollView
         style={styles.page}
         refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
         }
      >
         {/* Header */}
         <View style={styles.header}>
            <Text style={styles.babyName}>{baby ? baby.name : "Loading..."}</Text>
            <Text style={styles.liveText}>{live ? "Live" : "Not connected"}</Text>
         </View>

         {/* Error message, only if there is one */}
         {error ? <Text style={styles.error}>{error}</Text> : null}

         {/* Sensors */}
         <Text style={styles.sectionTitle}>Sensors</Text>
         {readingList.length === 0 ? (
            <Text style={styles.empty}>No readings yet.</Text>
         ) : (
            <View style={styles.cardGrid}>
               {readingList.map(function (reading) {
                  return <SensorCard key={reading.sensor_type} reading={reading} />;
               })}
            </View>
         )}

         {/* Events */}
         <Text style={styles.sectionTitle}>Recent Events</Text>
         {events.length === 0 ? (
            <Text style={styles.empty}>No events yet.</Text>
         ) : (
            events.slice(0, 10).map(function (event, index) {
               // Some live events have no id yet, so we use the index as a backup key.
               return <EventItem key={event.id || index} event={event} />;
            })
         )}

         {/* Log out */}
         <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
         </TouchableOpacity>

         {/* Go to the control screen */}
         <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.navigate("Control")}
         >
            <Text style={styles.controlButtonText}>Control Robot</Text>
         </TouchableOpacity>
         {/* Go to the emergency screen */}
         <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate("Emergency")}
         >
            <Text style={styles.controlButtonText}>Emergencies</Text>
         </TouchableOpacity>

         {/* Go to the video screen */}
         <TouchableOpacity
            style={styles.videoButton}
            onPress={() => navigation.navigate("Video")}
         >
            <Text style={styles.controlButtonText}>Live Video</Text>
         </TouchableOpacity>
         {/* Go to the settings screen */}
         <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
         >
            <Text style={styles.controlButtonText}>Settings</Text>
         </TouchableOpacity>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   babyName: { fontSize: 24, fontWeight: "bold" },
   liveText: { fontSize: 12, color: "#666666" },
   sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 8 },
   cardGrid: {
      flexDirection: "row",
      flexWrap: "wrap", // move to the next line when full
      justifyContent: "space-between",
   },
   empty: { color: "#999999", fontSize: 14, marginBottom: 8 },
   error: { color: "#cc0000", marginBottom: 12 },
   logout: {
      backgroundColor: "#cc4444",
      padding: 14,
      borderRadius: 8,
      marginTop: 24,
      marginBottom: 40,
   },
   logoutText: { color: "#ffffff", textAlign: "center", fontWeight: "bold" },
   controlButton: {
      backgroundColor: "#4a90d9",
      padding: 14,
      borderRadius: 8,
      marginTop: 24,
   },
   controlButtonText: { color: "#ffffff", textAlign: "center", fontWeight: "bold" },
   emergencyButton: {
      backgroundColor: "#cc4444",
      padding: 14,
      borderRadius: 8,
      marginTop: 24,
   },
   videoButton: {
      backgroundColor: "#5a5a8a",
      padding: 14,
      borderRadius: 8,
      marginTop: 10,
   },
   settingsButton: {
      backgroundColor: "#777777",
      padding: 14,
      borderRadius: 8,
      marginTop: 10,
   },
});
