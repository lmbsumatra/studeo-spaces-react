import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import html2canvas from "html2canvas"; // Import html2canvas

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(location.state);
    if (!location.state) {
      navigate("/booking"); // Redirect to the booking page if no state exists
    }

    // Block going back in history if location.state is not set
    const handlePopState = () => {
      if (!location.state) {
        navigate("/booking"); // Redirect to the booking page
      }
    };

    // Add event listener to prevent back navigation
    window.history.pushState(null, document.title); // Push a new state to the history
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup event listener when the component is unmounted
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.state, navigate]);

  const formatTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${period}`;
  };

  if (!location.state) {
    return null; // Avoid rendering if no booking details are passed
  }

  // Destructure the state passed from the previous page
  const {
    service_name = "N/A", // Top-level service_name
    emailSent = false, // Top-level emailSent
    details = {}, // Destructure the details object
  } = location.state || {};
  
  // Now, destructure the details object
  const {
    customer_id = "N/A",
    service_id = "N/A",
    pass_id = "N/A", 
    price = "N/A",
    date = "N/A",
    time = "N/A",
    name = "N/A",
    email = "N/A",
    contact_number = "N/A",
    payment_method = "N/A",
    refNumber = "N/A",
    seat_code = "N/A",
    pass_type = "N/A",
    status = "N/A",
    created_at = "N/A",
    updated_at = "N/A",
    service = {} // Destructure the service object
  } = details;
  
  // Destructure the service object
  const {
    service_code = "N/A",
    duration = "N/A",
    description = "N/A",
    images = "N/A", // Assuming this is an image URL
    count = "N/A",
    availability = "N/A",
    type = "N/A"
  } = service;
  

  const saveReceiptAsImage = () => {
    const element = document.querySelector(".card-body"); // Target only the card-body
    html2canvas(element, { scale: 2 }) // Higher scale for better quality
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `BookingSummary_${new Date().toISOString()}.png`; // Suggest a file name
        link.href = canvas.toDataURL("image/png");
        link.click(); // Programmatically trigger download
      })
      .catch((error) => {
        // console.error("Failed to save receipt as image:", error);
        alert("Something went wrong while saving the receipt. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="fs-700 ff-serif text-center">Booking Summary</h1>
          <hr />
          <h2 className="fs-600 ff-serif text-center">Receipt</h2>
          <p className="text-center">
            <strong>Reference Number:</strong> {refNumber}
          </p>
          <div className="mt-4">
            <h3 className="fs-500 ff-serif">Booking Details</h3>
            <p>
              <strong>Service Name:</strong> {service_name}
            </p>
            <p>
              <strong>Price:</strong> {price}
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
            {service_id === 4 && pass_id !== "N/A" && (
              <>
                <hr />
                <h3 className="fs-500 ff-serif">Pass ID</h3>
                <p>
                  <strong>Pass ID:</strong> {pass_id}
                </p>
              </>
            )}
            <h3 className="fs-500 ff-serif">Email Sent</h3>
            <p>{emailSent ? "Email Sent" : "Email Not Sent"}</p>
          </div>
          <div className="mt-5 text-center">
            <h4 className="fs-500 ff-serif">Thank you for your booking!</h4>
            <p className="fs-400">We look forward to serving you.</p>
          </div>
        </div>
        {/* Button to trigger the saveReceiptAsImage function */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={saveReceiptAsImage}>
            Download Receipt as Image
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSummary;
