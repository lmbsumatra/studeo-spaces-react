import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Sidebar from './components/header/Sidebar';
import Home from './pages/HomeScreen';
import Blog from './pages/BlogScreen';
import Services from './pages/ServicesScreen';
import Book from './pages/BookingScreen';
import FAQs from './pages/FAQs';
import Confirmation from './pages/ConfirmationScreen';
import Payment from './pages/PaymentScreen';
import BookingSummary from './pages/BookingSummary';
import BookingDetails from './pages/BookingDetails';
import AdminLogin from './pages/admin pages/AdminLoginScreen';
import AdminDashboard from './pages/admin pages/AdminDashboard';
import AdminBookings from './pages/admin pages/AdminBookings';
import AdminCustomers from './pages/admin pages/AdminCustomers';
import AdminPayments from './pages/admin pages/AdminPayments';
import AdminMessagesScreen from './pages/admin pages/AdminMessagesScreen';

const App = () => {
  const location = useLocation();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {isAdminPath && <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
      <div className="main-content">
        {location.pathname !== '/admin-login' && <Header />}
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

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
          <Route path="/admin-customers" element={<AdminCustomers />} />
          <Route path="/admin-payments" element={<AdminPayments />} />
          <Route path="/admin-messages" element={<AdminMessagesScreen />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
