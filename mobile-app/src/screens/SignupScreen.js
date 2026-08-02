// FILE: src/screens/SignupScreen.js
// JOB: Let a new parent create an account.

import React, { useState } from "react";
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
} from "react-native";
import { signup } from "../services/authService";
import { saveToken } from "../services/storageService";

export default function SignupScreen({ navigation, onLogin }) {
   const [fullName, setFullName] = useState("");
   const [phone, setPhone] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const [error, setError] = useState("");
   const [busy, setBusy] = useState(false);

   async function handleSignup() {
      setError("");
      setBusy(true);

      try {
         const result = await signup(email, password, fullName, phone);

         // If there is no token, the account needs email confirmation.
         if (!result.token) {
            setError(result.message || "Please confirm your email, then log in.");
            setBusy(false);
            return;
         }

         // Save the token and go straight into the app.
         await saveToken(result.token);
         onLogin();
      } catch (e) {
         setError(e.message);
      }

      setBusy(false);
   }

   return (
      // ScrollView lets the form scroll when the keyboard covers it.
      <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.title}>Create Account</Text>

         <TextInput
            style={styles.input}
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
         />

         <TextInput
            style={styles.input}
            placeholder="Phone (for emergency alerts)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
         />

         <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
         />

         <TextInput
            style={styles.input}
            placeholder="Password (at least 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
         />

         {error ? <Text style={styles.error}>{error}</Text> : null}

         <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={busy}>
            <Text style={styles.buttonText}>{busy ? "Please wait..." : "Sign Up"}</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Log in</Text>
         </TouchableOpacity>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#ffffff",
   },
   title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
   input: {
      borderWidth: 1,
      borderColor: "#cccccc",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
   },
   button: { backgroundColor: "#4a90d9", padding: 14, borderRadius: 8, marginTop: 8 },
   buttonText: {
      color: "#ffffff",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
   },
   link: { color: "#4a90d9", textAlign: "center", marginTop: 16 },
   error: { color: "#cc0000", marginBottom: 8, textAlign: "center" },
});
