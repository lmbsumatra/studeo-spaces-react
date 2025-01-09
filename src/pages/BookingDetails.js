import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { baseApiUrl, baseSocketUrl } from "../App.js";
import { Modal, Button } from 'react-bootstrap';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = io(`${baseSocketUrl}`, { transports: ["websocket"] });
  const [showModal, setShowModal] = useState(false); 
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

  const formatTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${period}`;
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const refNumber = location.state?.referenceNumber;
      if (!refNumber) {
        navigate("/booking");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${baseApiUrl}bookings/${refNumber}`);
        setBookingDetails(response.data);
      } catch (error) {
        // console.error("Error fetching booking details:", error);
        toast.error("Failed to fetch booking details.");
        navigate("/booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location.state, navigate]);

  const handleCancelBooking = () => {
    // Show the modal for confirmation
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false); // Close the modal without cancellation
  const handleConfirmCancel = async () => {
    setCancelConfirmed(true);
    // Proceed with cancellation if confirmed
    try {
      const response = await axios.post(
        `${baseApiUrl}bookings/cancel/${bookingDetails.refNumber}`
      );

      const bookingId = response.data.id; // Assuming 'id' is returned in the response
      const notificationData = {
        customer_id: location.state.customerID || null,
        customer_name: location.state.name,
        message: "A customer has canceled their booking.",
        type: "cancelbooking",
        action_url: null,
        related_data_id: bookingId,
      };

      // Notify via WebSocket
      socket.emit("cancelbooking", {
        ...notificationData,
        message_id: bookingId, // Include message ID in the notification data
      });

      // Show success message and redirect
      toast.success("Booking cancelled successfully.");
      navigate("/booking");
    } catch (error) {
      // console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking.");
    }
    handleModalClose();  // Close the modal after cancellation
  };

  const handleDone = () => {
    navigate("/booking");
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <h1 className="fs-700 ff-serif text-center">
              Booking Confirmation
            </h1>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return toast.error(
      "Error loading booking details. Please try again later."
    );
  }

  const {
    service,
    date,
    time,
    name,
    email,
    contact_number,
    payment_method,
    refNumber,
    customer_id,
    status,
  } = bookingDetails;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="fs-700 ff-serif text-center">Booking Confirmation</h1>
          <hr />
          <h2 className="fs-600 ff-serif text-center">Receipt</h2>
          <p className="text-center">
            <strong>Reference Number:</strong> {refNumber}
          </p>
          <div className="mt-4">
            <h3 className="fs-500 ff-serif">Booking Details</h3>
            <p>
              <strong>Service:</strong> {service ? service.name : "Loading..."}
            </p>
            <p>
              <strong>Service Price:</strong>{" "}
              {service ? `${service.price}` : "Loading..."}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Time:</strong> {formatTimeTo12Hour(time)}
            </p>
            <hr />
            <h3 className="fs-500 ff-serif">Personal Information</h3>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Contact Number:</strong> {contact_number}
            </p>
            <hr />
            <h3 className="fs-500 ff-serif">Payment Information</h3>
            <p>
              <strong>Payment Method:</strong> {payment_method}
            </p>
            <hr />
            <h3 className="fs-500 ff-serif">Customer ID</h3>
            <p>
              <strong>Customer ID:</strong> {customer_id}
            </p>
            <hr />
            <h3 className="fs-500 ff-serif">Booking Status</h3>
            <p>
              <strong>Status:</strong> {status}
            </p>
            <div className="mt-5 text-center">
              <h4 className="fs-500 ff-serif">Thank you for your booking!</h4>
              <p className="fs-400">We look forward to serving you.</p>
              {(status === "Pending" || status === "Completed") && (
                <button className="btn btn-danger" onClick={handleCancelBooking}>
                  Cancel Booking
                </button>
              )}
              {status === "Cancelled" && (
                <p className="fs-500 ff-serif text-danger">Your booking has been cancelled.</p>
              )}
              {status !== "Pending" && status !== "Completed" && status !== "Cancelled" && (
                <button className="btn btn-success" onClick={handleDone}>
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for cancellation warning */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to cancel this booking? Please note that cancellations are not refundable.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingDetails;
