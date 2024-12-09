import React, { useEffect, useState } from "react";
import Sidebar from "../../components/header/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { baseSocketUrl } from "../../App";
import { formatDate } from "../../utils/dateFormat";
import { formatTimeTo12Hour } from "../../utils/timeFormat";



const Admin = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();

 

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

    // Handle notifications based on message type
    const handleNotification = (data, type) => {
      const { message, time, date, id } = data;
  
      // Toast notifications for different message types
      switch (type) {
        case "inquiry":
          toast.info(<div className="notification-toast">
            <h4 className="header">New Inquiry</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/messages?highlight=${id}`}>View</a>
          </div>);
          break;
        case "feedback":
          toast.success(<div className="notification-toast">
            <h4 className="header">New Feedback</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/messages?highlight=${id}`}>View</a>
          </div>);
          break;
        case "complaint":
          toast.error(<div className="notification-toast">
            <h4 className="header">Complaint</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/messages?highlight=${id}`}>View</a>
          </div>);
          break;
        case "request":
          toast.info(<div className="notification-toast">
            <h4 className="header">New Request</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/messages?highlight=${id}`}>View</a>
          </div>);
          break;
        case "suggestion":
          toast.info(<div className="notification-toast">
            <h4 className="header">New Suggestion</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/messages?highlight=${id}`}>View</a>
          </div>);
          break;
        case "booking":
          toast.success(<div className="notification-toast">
            <h4 className="header">New Booking!</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/bookings?highlight=${id}`}>View</a>
          </div>);
          break;
        case "cancelbooking":
          toast.warning(<div className="notification-toast">
            <h4 className="header">Booking Cancelled</h4>
            <p className="message">{message}</p>
            <span className="datetime">{formatTimeTo12Hour(time)} {formatDate(date)}</span>
            <br/>
            <a className="link" href={`/admin/bookings?highlight=${id}`}>View</a>
          </div>);
          break;
        default:
          toast.info(`New message: ${message}`);
      }
    };

  useEffect(() => {
     // Initialize socket
  const socket = io(`${baseSocketUrl}:3002`, { transports: ["websocket"] });
    // Connect to the socket
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id); // Debugging
    });

    // Listen for different types of messages from socket
    socket.on("inquiry", (data) => {
      console.log("Received inquiry:", data); // Debugging
      handleNotification(data, "inquiry");
    });
    socket.on("feedback", (data) => {
      console.log("Received feedback:", data); // Debugging
      handleNotification(data, "feedback");
    });
    socket.on("complaint", (data) => {
      console.log("Received complaint:", data); // Debugging
      handleNotification(data, "complaint");
    });
    socket.on("request", (data) => {
      console.log("Received request:", data); // Debugging
      handleNotification(data, "request");
    });
    socket.on("suggestion", (data) => {
      console.log("Received suggestion:", data); // Debugging
      handleNotification(data, "suggestion");
    });
    socket.on("booking", (data) => {
      console.log("Received booking:", data); // Debugging
      handleNotification(data, "booking");
    });
    socket.on("cancelbooking", (data) => {
      console.log("Received cancelbooking:", data); // Debugging
      handleNotification(data, "cancelbooking");
    });

    // Clean up socket connection on unmount
    return () => {
      socket.off("inquiry");
      socket.off("feedback");
      socket.off("complaint");
      socket.off("request");
      socket.off("suggestion");
      socket.off("booking");
      socket.off("cancelbooking");
      socket.disconnect();
    };
  }, []);


  return (
    <div>
      <div
        className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}
      >
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
      <main
        className={`main-content ${
          isSidebarExpanded ? "expanded" : "collapsed"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
