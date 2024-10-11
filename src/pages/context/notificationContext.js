import React, { createContext, useContext, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";

// Create a context for notifications
const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3002", { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.io");
    });

    socketRef.current.on("new_user_login", (data) => {
      toast.info(data.message);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const emitEvent = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const notify = (message) => {
    toast.info(message);
  };

  return (
    <NotificationContext.Provider value={{ emitEvent, notify }}>
      {children}
      <ToastContainer position="bottom-right" />
    </NotificationContext.Provider>
  );
};