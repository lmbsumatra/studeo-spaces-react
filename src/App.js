// App.js
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./App.css";
import { NotificationProvider } from "../src/pages/context/notificationContext";

import Header from "../src/components/header/Header"
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
import Card from "./Card";
import Admin from "../src/pages/admin pages/Admin"

const App = () => {
  
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";


  return (
    <div>
      {!isLoginPage && (isAdminPath ? <Header /> : <Header />)}

      <Routes>
        <Route path="/card" element={<Card />} />
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
          element={<PrivateRoute><Admin /></PrivateRoute>}
        >
          {/* <Route
            path="/*"
            element={<Admin isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
          > */}
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />
            <Route
              path="bookings"
              element={<AdminBookings />}
            />
            <Route
              path="payments"
              element={<AdminPayments />}
            />
            <Route
              path="customers"
              element={<AdminCustomers />}
            />
            <Route
              path="messages"
              element={<AdminMessagesScreen />}
            />
            <Route
              path="services"
              element={<AdminServices title="Admin Services Management" />}
            />
            <Route
              path="/admin/add-service"
              element={<AdminAddService />}
            />
            <Route
              path="/admin/edit-service/:id"
              element={<AdminEditService />}
            />
          {/* </Route> */}
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
      
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Router>
);

export default AppWrapper;
