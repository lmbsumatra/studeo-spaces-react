//cofirmation.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const ConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure the component doesn't try to render without state
  useEffect(() => {
    if (!location.state) {
      navigate("/booking");
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

  const formatTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${period}`;
  };

  // Extract the state
  const {
    service_id,
    price,
    currentDate,
    time,
    name,
    email,
    contact_number,
    payment_method,
  } = location.state;

  // Create the bookingDetails object
  const bookingDetails = {
    service_id,
    price,
    currentDate,
    time,
    name,
    email,
    contact_number,
    payment_method,
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    navigate("/payment", { state: bookingDetails });
  };

  return (
    <div>
      <h1 className="fs-700 ff-serif text-center">Booking Confirmation</h1>
      <div className="container">
        <h2 className="fs-600 ff-serif">Booking Details</h2>
        <p>
          <strong>Service:</strong> {service_id}
        </p>
        <p>
          <strong>Price:</strong> {price}
        </p>
        <p>
          <strong>Date:</strong> {currentDate}
        </p>
        <p>
          <strong>Time:</strong> {formatTimeTo12Hour(time)}
        </p>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Contact Number:</strong> {contact_number}
        </p>
        <p>
          <strong>Payment Method:</strong> {payment_method}
        </p>
      </div>

      <div className="container text-center">
        <button
          className="btn btn-primary-clr"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationScreen;
