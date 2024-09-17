const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // The origin of your React app
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    allowEIO3: true,

    transport: ["websocket"],
  },
});

// Use CORS middleware for Express routes (if you have any)
app.use(
  cors({
    origin: "http://localhost:3001", // The origin of your React app
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],

    allowEIO3: true,

    transport: ["websocket"],
  })
);

// Store connected users
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle user registration
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  // Handle message sending
  socket.on("sendMessage", ({ recipientId, message }) => {
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", { message });
      console.log(`Message sent to ${recipientId}: ${message}`);
    } else {
      console.log(`Recipient ${recipientId} not connected`);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from the users list on disconnect
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(3002, () => {
  console.log("Server listening on port 3002");
});
