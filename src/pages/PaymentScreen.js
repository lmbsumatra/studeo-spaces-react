import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection once
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    // Clean up socket connection on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

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

      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings",
        bookingDetailsWithRef
      );

      await axios.post(
        "http://127.0.0.1:8000/api/notifications",
        notificationData
      );

      const { customerID } = response.data;
      toast.success("Your booking has been successful!");
      socket.emit("Notification", {message: "A customer has booked."});
      navigate("/booking-successful", {
        state: { ...bookingDetailsWithRef, customerID },
      });
    } catch (error) {
      console.error("There was an error creating the booking!", error);
      toast.error("Booking Failed. Please try again.");
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
    date,
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
