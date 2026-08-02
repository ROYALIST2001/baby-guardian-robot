// FILE: src/screens/LoginScreen.js
// JOB: Let the parent log in.

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { login } from "../services/authService";
import { saveToken } from "../services/storageService";

// "navigation" comes from React Navigation. "onLogin" is given by App.js.
export default function LoginScreen({ navigation, onLogin }) {
   // State for each input box.
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   // State for messages and the loading flag.
   const [error, setError] = useState("");
   const [busy, setBusy] = useState(false);

   // Runs when the Login button is tapped.
   async function handleLogin() {
      setError(""); // clear any old error
      setBusy(true); // show "Please wait"

      try {
         // Step 1: ask the backend for a token.
         const result = await login(email, password);

         // Step 2: save the token on the phone.
         await saveToken(result.token);

         // Step 3: tell App.js we are logged in.
         onLogin();
      } catch (e) {
         // Show the error on screen.
         setError(e.message);
      }

      setBusy(false);
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Baby Guardian</Text>
         <Text style={styles.subtitle}>Log in to your account</Text>

         <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" // do not capitalize emails
            keyboardType="email-address" // show the email keyboard
         />

         <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // hide the password
         />

         {/* Show the error only if there is one. */}
         {error ? <Text style={styles.error}>{error}</Text> : null}

         <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={busy}>
            <Text style={styles.buttonText}>{busy ? "Please wait..." : "Log In"}</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>No account? Sign up</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#ffffff",
   },
   title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 6 },
   subtitle: { fontSize: 14, textAlign: "center", color: "#666666", marginBottom: 24 },
   input: {
      borderWidth: 1,
      borderColor: "#cccccc",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
   },
   button: {
      backgroundColor: "#4a90d9",
      padding: 14,
      borderRadius: 8,
      marginTop: 8,
   },
   buttonText: {
      color: "#ffffff",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
   },
   link: { color: "#4a90d9", textAlign: "center", marginTop: 16 },
   error: { color: "#cc0000", marginBottom: 8, textAlign: "center" },
});
