import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./App.css";

import Header from "./components/header/Header";
import Sidebar from "./components/header/Sidebar";
import Home from "./pages/HomeScreen";
import Blog from "./pages/BlogsScreen";
import Services from "./pages/ServicesScreen";
import Book from "./pages/BookingScreen";
import FAQs from "./pages/FAQs";
import Confirmation from "./pages/ConfirmationScreen";
import Payment from "./pages/PaymentScreen";
import BookingSummary from "./pages/BookingSummary";
import BookingDetails from "./pages/BookingDetails";
import AdminLogin from "./pages/admin pages/AdminLoginScreen";
import AdminDashboard from "./pages/admin pages/AdminDashboard";
import AdminBookings from "./pages/admin pages/AdminBookings";
import AdminCustomers from "./pages/admin pages/AdminCustomers";
import AdminPayments from "./pages/admin pages/AdminPayments";
import AdminMessagesScreen from "./pages/admin pages/AdminMessagesScreen";
import AdminServices from "./pages/admin pages/admin-services/AdminServices";
import AdminAddService from "./pages/admin pages/admin-services/AdminAddService";
import AdminEditService from "./pages/admin pages/admin-services/AdminEditService";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  const socketRef = useRef(null);

  useEffect(() => {
    // Create a single socket connection
    socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

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

  const runEvent = () => {
    if (socketRef.current) {
      socketRef.current.emit("new_user_login", { message: "User has Logged In" });
    }
  };

  const runLocalEvent = () => {
    toast.info("This is a local event");
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div>
      {!isLoginPage && (isAdminPath ? <Header /> : <Header />)}
      {isAdminPath && (
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Book />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-successful" element={<BookingSummary />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Navigate to='/admin-dashboard' />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/"
          element={
            <PrivateRoute>
              <Navigate to='/admin-dashboard' />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-bookings"
          element={
            <PrivateRoute>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-payments"
          element={
            <PrivateRoute>
              <AdminPayments />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-customers"
          element={
            <PrivateRoute>
              <AdminCustomers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-messages"
          element={
            <PrivateRoute>
              <AdminMessagesScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-services"
          element={
            <PrivateRoute>
              <AdminServices title='Admin Services Management'/>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-add-service"
          element={
            <PrivateRoute>
              <AdminAddService />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-edit-service/:id"
          element={
            <PrivateRoute>
              <AdminEditService />
            </PrivateRoute>
          }
        />
      </Routes>

      {isAdminPath && <ToastContainer position="bottom-right" />}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
