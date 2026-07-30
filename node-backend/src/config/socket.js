// FILE: src/config/socket.js
// JOB: Create and share the Socket.IO server.

const { Server } = require("socket.io");

// We keep the Socket.IO server in this variable once it is made.
let io = null;

// Called once from server.js. It attaches Socket.IO to the raw web server.
function init(httpServer) {
   io = new Server(httpServer, {
      // Allow any app to connect for now. We can tighten this later.
      cors: { origin: "*" },
   });

   // Runs when an app opens a live connection.
   io.on("connection", function (socket) {
      console.log("Socket.IO: a client connected");

      // Runs when that app closes the connection.
      socket.on("disconnect", function () {
         console.log("Socket.IO: a client disconnected");
      });
   });

   return io;
}

// Other files call this to get the io object so they can emit messages.
function getIo() {
   return io;
}

module.exports = { init: init, getIo: getIo };
