import React, { useEffect, useState } from "react";
import Sidebar from "../../components/header/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { baseSocketUrl } from "../../App";

const notificationTypes = {
  new_booking: "success",
  booking_confirmation: "info",
  booking_cancellation: "warning",
  booking_rescheduled: "info",
  booking_reminder: "info",
  payment_received: "success",
  payment_failed: "error",
  refund_processed: "success",
  system_alert: "warning",
  feature_update: "info",
  scheduled_maintenance: "warning",
  customer_registration: "success",
  customer_feedback: "info",
  customer_report: "warning",
  special_event: "info",
  event_reminder: "info",
  admin_action_required: "warning",
  policy_change: "info",
  error_alert: "error",
  warning_message: "warning",
  customer_message: "info",
  admin_add_service: "success",
  admin_edit_service: "info",
  admin_delete_service: "success",
  admin_login: "info",
  admin_logout: "info",
};

const Admin = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  // Initialize socket
  const socket = io(`${baseSocketUrl}:3002`, { transports: ['websocket'] });

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const socket = io(`${baseSocketUrl}:3002`, { transports: ['websocket'] });
  
    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });
  
    socket.on("Notification", (data) => {
      const { message, type } = data;
      const category = notificationTypes[type] || "info";
  
      switch (category) {
        case "success":
          toast.success(message, {
            onClick: () => navigate(`/admin/bookings?highlight=1`),
          });
          break;
        case "warning":
          toast.warning(message, {
            onClick: () => navigate(`/admin/bookings?highlight=1`),
          });
          break;
        case "error":
          toast.error(message, {
            onClick: () => navigate(`/admin/bookings?highlight=1`),
          });
          break;
        default:
          toast.info(message, {
            onClick: () => navigate(`/admin/bookings?highlight=1`),
          });
      }
    });
  
    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });
  
    return () => {
      socket.off("Notification");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect(); // Clean up socket connection
    };
  }, [navigate]);
  

  return (
    <div>
      <div className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
      <main className={`main-content ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <Outlet/>
      </main>
    </div>
  );
};

export default Admin;