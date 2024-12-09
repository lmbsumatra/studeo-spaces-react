// App.js
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "../src/components/header/Header";
import Home from "./pages/HomeScreen";
import Blog from "./pages/BlogsScreen";
import Services from "./pages/ServicesScreen";
import Book from "./pages/booking-screen/BookingScreen";
import FAQs from "./pages/FAQs";
import Confirmation from "./pages/ConfirmationScreen";
import Payment from "./pages/PaymentScreen";
import BookingSummary from "./pages/BookingSummary";
import BookingCancelled from "./pages/BookingCancelled";
import BookingDetails from "./pages/BookingDetails";
import AdminLogin from "./pages/admin pages/AdminLoginScreen";
import AdminDashboard from "./pages/admin pages/admin-dashboard/AdminDashboard";
import AdminBookings from "./pages/admin pages/AdminBookings";
import AdminCustomers from "./pages/admin pages/AdminCustomers";
import AdminPayments from "./pages/admin pages/AdminPayments";
import AdminMessagesScreen from "./pages/admin pages/AdminMessagesScreen/AdminMessagesScreen";
import AdminServices from "./pages/admin pages/admin-services/AdminServices";
import AdminAddService from "./pages/admin pages/admin-services/AdminAddService";
import AdminEditService from "./pages/admin pages/admin-services/AdminEditService";
import PrivateRoute from "./context/PrivateRoute";
import Admin from "../src/pages/admin pages/Admin";

import PageNotAvailable from "./pages/PageNotAvailable";
import AdminFeedbackScreen from "./pages/admin pages/admin-feedbacks/AdminFeedbackScreen";
import PoliciesScreen from "./pages/PoliciesScreen";
import TermsAndConditionScreen from "./pages/TermsAndConditionScreen";
import AdminSettings from "./pages/admin pages/AdminSettings";
import AdminBlog from "./pages/admin pages/admin-blog/AdminBlog";
import AdminCreate from "./pages/admin pages/admin-blog/AdminCreate";
import BlogDetail from "./components/AdminBlog/BlogDetail";
import AdminEditBlog from "./pages/admin pages/admin-blog/AdminEditBlog";
import UserBlogDetail from "./components/blogs/UserBlogDetail";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {!isLoginPage && (isAdminPath ? <Header /> : <Header />)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs-details/:id" element={<UserBlogDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Book />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-cancelled" element={<BookingCancelled />} />
        <Route path="/booking-successful" element={<BookingSummary />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/terms-and-conditions" element={<PoliciesScreen />} />
        <Route path="/policies" element={<TermsAndConditionScreen />} />

        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          {/* <Route
            path="/*"
            element={<Admin isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
          > */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="messages" element={<AdminMessagesScreen />} />
          <Route path="feedbacks" element={<AdminFeedbackScreen />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route
            path="services"
            element={<AdminServices title="Admin Services Management" />}
          />
          <Route path="/admin/add-service" element={<AdminAddService />} />
          <Route
            path="/admin/edit-service/:id"
            element={<AdminEditService />}
          />
          <Route
            path="/admin/content-management"
            element={<PageNotAvailable />}
          />
          <Route path="/admin/blogs" element={<AdminBlog />} />
          <Route path="/admin/blogs-create" element={<AdminCreate />} />
          <Route path="/admin/blogs-edit/:id" element={<AdminEditBlog />} />
          <Route path="/admin/blogs-details/:id" element={<BlogDetail />} />
          
          <Route path="/admin/*" element={<PageNotAvailable />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

          {/* </Route> */}
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/*" element={<PageNotAvailable />} />
        <Route path="/*/*" element={<PageNotAvailable />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <ToastContainer />
    <App />
  </Router>
);

export default AppWrapper;

export const baseApiUrl = `https://studeo-spaces-react-production.up.railway.app/api/`;

export const baseSocketUrl = `http://${window.location.hostname}`;
