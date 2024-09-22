const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const os = require('os');

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const addr of interfaces[iface]) {
      if (addr.family === 'IPv4' && !addr.internal) {
        if (addr.address.startsWith('192.168.100.')) {
          return addr.address;
        }
      }
    }
  }
  return '127.0.0.1';
};

const baseSocketUrl = `http://${getLocalIp()}`;
console.log(`Base Socket URL: ${baseSocketUrl}`);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [`${baseSocketUrl}:3001`, `${baseSocketUrl}:3000`],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors({
  origin: [
    `${baseSocketUrl}:3001`,
    `${baseSocketUrl}:3000`,
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

io.on("connection", (socket) => {
  console.log("Admin connected");

  socket.on("Notification", (data) => {
    console.log(`Notification received: ${data.message}`);
    io.emit("Notification", {
      message: data.message,
      type: data.type,
    });
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

server.listen(3002, () => {
  console.log("Server listening on port 3002");
});
