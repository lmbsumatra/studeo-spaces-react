const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const os = require("os");
const moment = require("moment-timezone");

// Helper function to get the local IP address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const addr of interfaces[iface]) {
      if (addr.family === "IPv4" && !addr.internal) {
        if (addr.address.startsWith("192.168.")) {
          return addr.address;
        }
      }
    }
  }
  return "127.0.0.1";
};

// Set up the base socket URL
const baseSocketUrl = `https://inspiring-clarity-production.up.railway.app/`; // Local IP for local dev, but it should work on Railway with public URL
// console.log(`Base Socket URL: ${baseSocketUrl}`);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://studeo-spaces-react.vercel.app/",  // Allow connections from any domain (you can restrict this as needed)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors({
  origin: "*",  // Allow connections from any domain (you can restrict this as needed)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

// Function to get the current date in PHT
const getPHTDate = () => {
  return moment().tz("Asia/Manila").format("YYYY-MM-DD");  // Date only in PHT
};

// Function to get the current time in PHT
const getPHTTime = () => {
  return moment().tz("Asia/Manila").format("HH:mm:ss");  // Time only in PHT
};

// Handle socket connection events
io.on("connection", (socket) => {
  // console.log("Admin connected");

  // Handle inquiries
  socket.on("inquiry", (data) => {
    // console.log(`Inquiry received: ${data.message}`);
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
    // console.log(`Feedback received: ${data.message}`);
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
    // console.log(`Complaint received: ${data.message}`);
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
    // console.log(`Suggestion received: ${data.message}`);
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
    // console.log(`Booking received: ${data.message}`);
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
    // console.log(`Booking cancellation received: ${data.message}`);
    io.emit("cancelbooking", {
      message: data.message,
      type: "cancelbooking",
      date: getPHTDate(),  // Date in PHT
      time: getPHTTime(),  // Time in PHT
      id: data.message_id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log("Admin disconnected");
  });
});

// Start the server on the dynamic port provided by Railway
const port = process.env.PORT || 3002;  // Use Railway's dynamic port
server.listen(port, () => {
  // console.log(`Server listening on port ${port}`);
});
