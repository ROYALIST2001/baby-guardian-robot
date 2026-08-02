// FILE: src/services/socketService.js
// JOB: Open and close the live Socket.IO connection.

import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

// We keep one socket for the whole app.
let socket = null;

// Open the connection and return it.
export function connectSocket() {
   // "transports: websocket" tells it to use the direct live connection.
   // On phones this is more reliable than the default.
   socket = io(API_BASE_URL, {
      transports: ["websocket"],
   });

   return socket;
}

// Close the connection. We call this when leaving the screen.
export function disconnectSocket() {
   if (socket) {
      socket.disconnect();
      socket = null;
   }
}
