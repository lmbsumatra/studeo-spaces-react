import React, { useEffect, useState } from "react";
import Sidebar from "../../components/header/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css"; // Import your CSS file

const Admin = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  
  // Initialize socket
  const socket = io("http://localhost:3002");

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    // Listen for the 'Notification' event
    socket.on("Notification", (data) => {

      // Show toast notification
      toast.info(data.message, {
        onClick: () => {
          // Navigate to bookings page with query param
          navigate(`/admin/bookings?highlight=1`);
        },
      });
    });

    // Cleanup: Make sure to remove the correct event listener
    return () => {
      socket.off("Notification"); // Proper event name
    };
  }, [navigate, socket]);

  return (
    <div className="">
      <div className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
      <main className={`main-content ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <Outlet /> {/* Render nested routes here */}
      </main>
       
    </div>
  );
};

export default Admin;
