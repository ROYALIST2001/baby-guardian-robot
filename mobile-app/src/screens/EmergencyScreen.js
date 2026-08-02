// FILE: src/screens/EmergencyScreen.js
// JOB: Show unresolved emergencies clearly and let the parent handle them.

import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   ScrollView,
   TouchableOpacity,
   StyleSheet,
   RefreshControl,
} from "react-native";

import { getEvents, resolveEvent } from "../services/dataService";
import { connectSocket } from "../services/socketService";

export default function EmergencyScreen() {
   const [emergencies, setEmergencies] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   // Keep only unresolved emergencies from a list of events.
   function filterEmergencies(events) {
      return events.filter(function (event) {
         return event.severity === "emergency" && event.resolved === false;
      });
   }

   // Load events from the backend.
   async function loadEmergencies() {
      try {
         setError("");
         const events = await getEvents();
         setEmergencies(filterEmergencies(events));
         setLoading(false);
      } catch (e) {
         setError(e.message);
         setLoading(false);
      }
   }

   // Runs once when the screen opens.
   useEffect(function () {
      loadEmergencies();

      // Listen for new emergencies arriving live.
      const socket = connectSocket();
      socket.on("event", function (data) {
         if (data.severity === "emergency") {
            // Add it to the top of the list.
            setEmergencies(function (previous) {
               return [data, ...previous];
            });
         }
      });
   }, []);

   // Runs when "Mark as handled" is tapped.
   async function handleResolve(eventId) {
      setError("");
      try {
         await resolveEvent(eventId);

         // Remove it from the list on screen.
         setEmergencies(function (previous) {
            return previous.filter(function (item) {
               return item.id !== eventId;
            });
         });
      } catch (e) {
         setError(e.message);
      }
   }

   return (
      <ScrollView
         style={styles.page}
         refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadEmergencies} />
         }
      >
         {error ? <Text style={styles.error}>{error}</Text> : null}

         {emergencies.length === 0 ? (
            // The calm state: no emergencies.
            <View style={styles.calmBox}>
               <Text style={styles.calmTitle}>All Clear</Text>
               <Text style={styles.calmText}>No active emergencies.</Text>
            </View>
         ) : (
            // The alert state: show each emergency clearly.
            emergencies.map(function (event, index) {
               return (
                  <View key={event.id || index} style={styles.alertCard}>
                     <Text style={styles.alertTitle}>
                        {event.event_type.toUpperCase()}
                     </Text>
                     <Text style={styles.alertText}>
                        {event.description || "Emergency detected"}
                     </Text>

                     {/* Only show the button if we have a real id from the database. */}
                     {event.id ? (
                        <TouchableOpacity
                           style={styles.resolveButton}
                           onPress={function () {
                              handleResolve(event.id);
                           }}
                        >
                           <Text style={styles.resolveText}>Mark as handled</Text>
                        </TouchableOpacity>
                     ) : (
                        <Text style={styles.pendingText}>Pull down to refresh</Text>
                     )}
                  </View>
               );
            })
         )}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
   calmBox: {
      backgroundColor: "#e8f5e8",
      borderRadius: 12,
      padding: 30,
      alignItems: "center",
      marginTop: 20,
   },
   calmTitle: { fontSize: 22, fontWeight: "bold", color: "#2e7d32", marginBottom: 6 },
   calmText: { fontSize: 14, color: "#4a7a4a" },
   alertCard: {
      backgroundColor: "#cc0000",
      borderRadius: 12,
      padding: 20,
      marginBottom: 14,
   },
   alertTitle: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginBottom: 6 },
   alertText: { fontSize: 14, color: "#ffe0e0", marginBottom: 16 },
   resolveButton: {
      backgroundColor: "#ffffff",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
   },
   resolveText: { color: "#cc0000", fontWeight: "bold" },
   pendingText: { color: "#ffe0e0", fontSize: 12, textAlign: "center" },
   error: { color: "#cc0000", marginBottom: 12 },
});
