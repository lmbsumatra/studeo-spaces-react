import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const generateReferenceNumber = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referenceNumber = '';
    for (let i = 0; i < 6; i++) {
      referenceNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referenceNumber;
  };

  const referenceNumber = generateReferenceNumber();

  const handleBookingSummary = async () => {
    const bookingDetailsWithRef = { ...location.state, refNumber: referenceNumber };
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingDetailsWithRef);
      const { customerID } = response.data; 
      console.log('Booking successful!', response.data);
      navigate("/booking-successful", { state: { ...bookingDetailsWithRef, customerID } });
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        alert(`There was an error creating the booking! ${error.response.data.message}`);
      } else {
        console.error('There was an error creating the booking!', error);
        alert('There was an error creating the booking! Please try again.');
      }
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

  const { service, date, time, name, email, contact_number, payment_method } = location.state;

  return (
    <div>
      <div className="container">
        <h2 className="fs-600 ff-serif">Booking Details</h2>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Contact Number:</strong> {contact_number}</p>
        <p><strong>Payment Method:</strong> {payment_method}</p>
        <p><strong>Reference Number:</strong> {referenceNumber}</p>
      </div>
      <button className="btn btn-primary-clr" onClick={handleBookingSummary}>
        Proceed to Booking Summary
      </button>
    </div>
  );
};

export default Payment;
