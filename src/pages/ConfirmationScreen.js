// confirmation.js
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

  // Function to generate a random reference number
  const generateReferenceNumber = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referenceNumber = "";
    for (let i = 0; i < 6; i++) {
      referenceNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referenceNumber;
  };

  const referenceNumber = generateReferenceNumber(); // Generate the reference number

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

  // Create the bookingDetails object, including the reference number
  const bookingDetails = {
    service_id,
    service_name,
    price,
    date: currentDate,
    time,
    name,
    email,
    contact_number,
    payment_method,
    refNumber: referenceNumber, // Add the reference number here
  };

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
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-canceled`,
        booking_details: bookingDetails, // Send booking details along
      };
  
      console.log("Request Data:", requestData);
  
      // Adjust the API URL (ensure it points to your backend)
      const response = await axios.post(`${baseApiUrl}bookings`, bookingDetails);
      console.log(response)
      
      // Handle response and redirect to checkout session URL
      if (response.data.checkout_url) {
        const checkoutUrl = response.data.checkout_url;
        window.location.href = checkoutUrl; // Redirect to PayMongo checkout
      } else {
        toast.error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("There was an error with the payment process. Please try again.");
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
        <p>
          <strong>Reference Number:</strong> {referenceNumber} {/* Display the reference number */}
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
