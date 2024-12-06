//cofirmation.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { baseApiUrl, baseSocketUrl } from "../App.js";
import axios from "axios";

const ConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    service_name,
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
    service_name,
    price,
    currentDate,
    time,
    name,
    email,
    contact_number,
    payment_method,
  };

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const requestData = {
        description: `Booking for Service: ${service_name}`, // Include service_name in the description
        line_items: [
          {
            name: service_name, // Set service_name as the line item name
            amount: parseFloat(price) * 100, // Convert price to cents (if necessary)
            currency: "PHP",
            quantity: 1,
          },
        ],
        success_url: `http://localhost:3000/payment`,
        cancel_url: `http://localhost:3000/booking`,
        booking_details: bookingDetails, // Send booking details along
      };

      console.log("Request Data:", requestData);

      const response = await axios.post(
        `${baseApiUrl}create-checkout-session`,
        requestData
      );
      const checkoutUrl = response.data.checkout_url;
      window.location.href = checkoutUrl; // Redirect to PayMongo checkout
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="fs-700 ff-serif text-center">Booking Confirmation</h1>
      <div className="container">
        <h2 className="fs-600 ff-serif">Booking Details</h2>
        <p>
          <strong>Service:</strong> {service_name}
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
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationScreen;
