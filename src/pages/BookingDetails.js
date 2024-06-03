import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const refNumber = location.state?.referenceNumber;
      if (!refNumber) {
        navigate("/booking");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${refNumber}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        alert('Failed to fetch booking details.');
        navigate("/booking");
      }
    };

    fetchBookingDetails();
  }, [location.state, navigate]);

  if (!bookingDetails) {
    return <p>Loading...</p>;
  }

  const { service, date, time, name, email, contact_number, payment_method, refNumber } = bookingDetails;

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
              <strong>Service:</strong> {service}
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
          </div>
          <div className="mt-5 text-center">
            <h4 className="fs-500 ff-serif">Thank you for your booking!</h4>
            <p className="fs-400">We look forward to serving you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
