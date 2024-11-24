import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import html2canvas from "html2canvas"; // Import html2canvas

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.location.reload();
      navigate("/booking");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const formatTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${period}`;
  };

  // Function to generate Customer ID
  const generateCustomerID = (userId) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
    const incrementalId = String(userId).padStart(3, "0"); // Pad the user ID to 3 digits
    return `${year}${month}${day}-${incrementalId}`;
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/booking");
    }
  }, [location.state, navigate]);

  const {
    service_id = "N/A",
    service_name = "N/A",
    price = "N/A",
    date = "N/A",
    time = "N/A",
    name = "N/A",
    email = "N/A",
    contact_number = "N/A",
    payment_method = "N/A",
    refNumber = "N/A",
    customerID = "N/A",
  } = location.state || {};

  // Generate the formatted Customer ID
  const formattedCustomerID = generateCustomerID(customerID);

  if (!location.state) {
    return null;
  }

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
        console.error("Failed to save receipt as image:", error);
        alert(
          "Something went wrong while saving the receipt. Please try again."
        );
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
              <strong>Customer ID:</strong> {formattedCustomerID}
            </p>
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
