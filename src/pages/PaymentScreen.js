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
  const [bookingDetails, setBookingDetails] = useState(null);
  const socket = io(`${baseSocketUrl}`, { transports: ["websocket"] });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state");

    if (state) {
      // Parse and set the booking details
      const parsedDetails = JSON.parse(state);
      setBookingDetails(parsedDetails);
      console.log("Booking details from state:", parsedDetails);
    } else {
      // Redirect to /home if state is missing
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (bookingDetails) {
      handleBookingSummary();
    }
  }, [bookingDetails]);

  const handleBookingSummary = async () => {
    if (!bookingDetails) return;

    const { details } = bookingDetails;
    const {
      id,
      customer_id,
      service_id,
      price,
      date,
      time,
      name,
      email,
      contact_number,
      payment_method,
      seat_code,
      pass_type,
      refNumber,
    } = details;

    const notificationData = {
      customer_id: customer_id || null,
      customer_name: name,
      message: "A customer has booked.",
      type: "booking",
      action_url: null,
    };

    try {
      setLoading(true);

      // Step 1: Use the ID directly from the state
      const bookingId = id;
      notificationData.related_data_id = bookingId;

      // Step 2: Send the email receipt
      const emailData = {
        email: email,
        name: name,
        service_id: service_id,
        price: price,
        date: date,
        time: time,
        refNumber: refNumber,
        customer_id: customer_id,
      };

      const emailResponse = await axios.post(
        `${baseApiUrl}send-receipt`,
        emailData
      );
      if (emailResponse.status !== 200) {
        throw new Error("Failed to send email.");
      }

      // Step 3: Send the notification
      await axios.post(`${baseApiUrl}notifications`, notificationData);
      socket.emit("booking", {
        ...notificationData,
        message_id: bookingId, // Include message ID in the notification data
      });

      toast.success("Your booking has been successful!");

      // Wait for 5 seconds and then redirect to booking summary
      /*setTimeout(() => {
        navigate("/booking-successful", {
          state: { ...bookingDetails, emailSent: true }, // Pass emailSent flag
        });
      }, 5000); // Redirect after 5 seconds */
    } catch (error) {
      // console.error("Error during booking process:", error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return null; // Avoid rendering if booking details are missing

  return (
    <div>
      <div className="container text-center mt-5">
        <h2 className="fs-600 ff-serif">Payment Successful!</h2>
        <div className="details-container">
          <div className="mt-3">
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Redirecting to booking summary..."
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
