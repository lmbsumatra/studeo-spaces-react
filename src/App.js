import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Home from "./pages/HomeScreen";
import Blog from "./pages/BlogScreen";
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
import Sidebar from "./components/header/Sidebar";

import PrivateRoute from "./PrivateRoute";

const App = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";
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
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
