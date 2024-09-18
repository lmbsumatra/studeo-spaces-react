const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'], // The origin of your React app
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    allowEIO3: true,
  },
});

// CORS middleware for Express routes (if needed)
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

io.on("connection", (socket) => {
  console.log("Admin connected");

  // Handle incoming notifications from any admin
  socket.on("Notification", (data) => {
    console.log(`Notification received: ${data.message}`);
    
    // Emit the notification to all connected clients
    io.emit("Notification", { 
      message: data.message, 
      type: data.type // Ensure the type is passed here
    });
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});


server.listen(3002, () => {
  console.log("Server listening on port 3002");
});
