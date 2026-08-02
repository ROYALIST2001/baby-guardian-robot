// FILE: App.js
// JOB: The entry point. It shows our screen.

import React from "react";
import HealthScreen from "./src/screens/HealthScreen";

export default function App() {
   // For now we show one screen.
   // In a later part we add navigation to switch between screens.
   return <HealthScreen />;
}
