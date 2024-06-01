import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const ConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/payment");
  };
  
  const { service, date, time, name, email, contact_number, payment_method } = location.state;

  return (
    <div>
      <h1 className="fs-700 ff-serif text-center">Booking Confirmation</h1>
      <div className="container">
        <h2 className="fs-600 ff-serif">Booking Details</h2>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Contact Number:</strong> {contact_number}</p> {/* Correctly access snake_case */}
        <p><strong>Payment Method:</strong> {payment_method}</p> {/* Correctly access snake_case */}
      </div>

      <div className="container text-center">
        <button className="btn btn-primary-clr" onClick={handleProceedToPayment}>
          Proceed to Payment
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationScreen;
