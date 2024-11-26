import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseApiUrl, baseSocketUrl } from "../App.js";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const socket = io(`${baseSocketUrl}:3002`, { transports: ["websocket"] });

  const generateReferenceNumber = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referenceNumber = "";
    for (let i = 0; i < 6; i++) {
      referenceNumber += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return referenceNumber;
  };

  const referenceNumber = generateReferenceNumber();

  const handleBookingSummary = async () => {
    if (!location.state) return;

    const bookingDetailsWithRef = {
      ...location.state,
      refNumber: referenceNumber,
      date: location.state.currentDate, // Using currentDate from location.state
    };

    const notificationData = {
      customer_id: location.state.customerID || null,
      customer_name: location.state.name,
      message: "A customer has booked.",
      type: "new_booking",
      action_url: null,
    };

    try {
      setLoading(true);

      console.log("Booking details:", bookingDetailsWithRef);

      // Step 1: Make the POST request for booking
      const response = await axios.post(
        `${baseApiUrl}bookings`,
        bookingDetailsWithRef
      );

      const bookingId = response.data.id; // Assuming 'id' is returned in the response
      notificationData.related_data_id = bookingId;
      console.log(notificationData);
      await axios.post(`${baseApiUrl}notifications`, notificationData);
      // Step 2: Send the email receipt
      const emailData = {
        email: location.state.email,
        name: location.state.name,
        service_name: location.state.service_name,
        price: location.state.price,
        date: location.state.currentDate,
        time: location.state.time,
        refNumber: referenceNumber,
      };

      const { customerID } = response.data;
      // toast.success("Your booking has been successful!");

      const emailResponse = await axios.post(
        `${baseApiUrl}send-receipt`,
        emailData
      ); // API endpoint for sending the receipt email
      if (emailResponse.status !== 200) {
        throw new Error("Failed to send email.");
      } else {
        console.log(emailResponse);
      }

      // Step 3: Send the notification
      // Ensure socket is connected before emitting
      socket.emit("booking", {
        ...notificationData,
        message_id: bookingId, // Include message ID in the notification data
      });

      toast.success("Your booking has been successful!");

      // Step 4: Redirect to Booking Summary
      navigate("/booking-successful", {
        state: { ...bookingDetailsWithRef, customerID, emailSent: true }, // Pass emailSent flag
      });
    } catch (error) {
      console.error("Error during booking process:", error);

      // Log specific error details for easier debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      toast.error("Booking failed. Please try again.");
      navigate("/booking", { state: location.state });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/booking");
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

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

  return (
    <div>
      <div className="container text-center mt-5">
        <h2 className="fs-600 ff-serif">Payment Integration</h2>
        <button
          className="btn btn-primary-clr mt-5"
          onClick={handleBookingSummary}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Processing
            </>
          ) : (
            "Proceed to Booking Summary"
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
