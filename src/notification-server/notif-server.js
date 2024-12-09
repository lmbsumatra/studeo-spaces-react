const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const os = require('os');
const moment = require("moment-timezone");

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const addr of interfaces[iface]) {
      if (addr.family === 'IPv4' && !addr.internal) {
        if (addr.address.startsWith('192.168.')) {
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

const getPHTDate = () => {
  return moment().tz('Asia/Manila').format('YYYY-MM-DD'); // Date only in PHT
};

const getPHTTime = () => {
  return moment().tz('Asia/Manila').format('HH:mm:ss'); // Time only in PHT
};

io.on("connection", (socket) => {
  console.log("Admin connected");

  // Handle inquiries
  socket.on("inquiry", (data) => {
    console.log(`Inquiry received: ${data.message}`);
    io.emit("inquiry", {
      message: data.message,
      type: "inquiry",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle feedback
  socket.on("feedback", (data) => {
    console.log(`Feedback received: ${data.message}`);
    io.emit("feedback", {
      message: data.message,
      type: "feedback",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle complaints
  socket.on("complaint", (data) => {
    console.log(`Complaint received: ${data.message}`);
    io.emit("complaint", {
      message: data.message,
      type: "complaint",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle requests
  socket.on("request", (data) => {
    console.log(`Request received: ${data.message}`);
    io.emit("request", {
      message: data.message,
      type: "request",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle suggestions
  socket.on("suggestion", (data) => {
    console.log(`Suggestion received: ${data.message}`);
    io.emit("suggestion", {
      message: data.message,
      type: "suggestion",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle bookings
  socket.on("booking", (data) => {
    console.log(`Booking received: ${data.message}`);
    io.emit("booking", {
      message: data.message,
      type: "booking",
      date: getPHTDate(),  // Date in PHT
      id: data.message_id,
      time: getPHTTime(),  // Time in PHT
    });
  });

  // Handle booking cancellations
  socket.on("cancelbooking", (data) => {
    console.log(`Booking cancellation received: ${data.message}`);
    io.emit("cancelbooking", {
      message: data.message,
      type: "cancelbooking",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

server.listen(3002, () => {
  console.log("Server listening on port 3002");
});
