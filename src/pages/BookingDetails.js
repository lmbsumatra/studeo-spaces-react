import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const refNumber = location.state?.referenceNumber;
      if (!refNumber) {
        navigate("/booking");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/bookings/${refNumber}`
        );
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to fetch booking details.");
        navigate("/booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location.state, navigate]);

  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/bookings/cancel/${bookingDetails.refNumber}`
        );
        alert("Booking cancelled successfully.");
        navigate("/booking");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking.");
      }
    }
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
    return toast.error("Error loading booking details. Please try again later.");
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
              {service ? `$${service.price}` : "Loading..."}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Time:</strong> {time}
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
              {status === "Pending" ? (
                <button
                  className="btn btn-danger"
                  onClick={handleCancelBooking}
                >
                  Cancel Booking
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleDone}>
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
