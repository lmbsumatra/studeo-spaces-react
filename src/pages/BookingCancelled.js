import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
// import "./BookingCancelled.css"; // Assuming you'll have custom styles for this page

const BookingCancelled = () => {
  const navigate = useNavigate();

  // Function to handle redirection, e.g., go back to homepage or booking page
  const handleRedirect = () => {
    navigate("/"); // Redirect to homepage or another page
  };

  return (
    <div className="container mt-5 booking-cancelled-container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="cancelled-message">
            <h1 className="cancelled-title">Booking Cancelled</h1>
            <p className="cancelled-text">
              We're sorry to inform you that your booking has been cancelled. If
              this was a mistake or you need further assistance, please contact
              support.
            </p>
            <button className="btn btn-primary" onClick={handleRedirect}>
              Go Back to Homepage
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingCancelled;
