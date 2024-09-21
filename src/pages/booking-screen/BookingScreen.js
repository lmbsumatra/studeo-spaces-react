import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer";
import Service from "../../components/services/Service";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import "./style.css";
import Promo from "../../components/promo/Promo";

const Book = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = location.state;

  useEffect(() => {
    if (serviceId) {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("en-CA"));

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      // Fetch service details here
      const fetchServiceDetails = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/services/${serviceId}`
          );
          setSelectedService(response.data);
        } catch (error) {
          console.error("Error fetching service details:", error);
          setSelectedService(null);
        }
      };

      fetchServiceDetails();
    } else {
      setSelectedService(null);
    }
  }, [serviceId]);

  const handleBookNowClick = async () => {
    const missingFields = [];

    if (!selectedService || !selectedService.id) {
      missingFields.push("Service");
    }
    if (!currentDate) {
      missingFields.push("Date");
    }
    if (!time) {
      missingFields.push("Time");
    }
    if (!name || name.trim() === "") {
      missingFields.push("Name");
    }
    if (!email || email.trim() === "") {
      missingFields.push("Email");
    }
    if (!contactNumber || contactNumber.trim() === "") {
      missingFields.push("Contact Number");
    }
    if (!paymentMethod || paymentMethod.trim() === "") {
      missingFields.push("Payment Method");
    }

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
      alert("Please fill in all required fields.");
      return;
    }

    const bookingDetails = {
      service_id: selectedService.id,
      price: selectedService.price,
      currentDate,
      time,
      name,
      email,
      contact_number: contactNumber,
      payment_method: paymentMethod,
      customerID,
    };

    setLoading(true);
    try {
      console.log(bookingDetails.currentDate);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/confirmation", { state: bookingDetails });
    } catch (error) {
      console.error("Error booking:", error);
      alert("Error booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckBookingClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/${referenceNumber}`
      );
      response.data.message
        ? alert(response.data.message)
        : navigate("/booking-details", { state: { referenceNumber } });
    } catch (error) {
      console.error("Error checking booking:", error);
      toast.error("Error: Invalid Booking Id");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCustomerID = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: customer } = await axios.get(
        `http://127.0.0.1:8000/api/customers/${customerID}`
      );
      setName(customer.name);
      setEmail(customer.email);
      setContactNumber(customer.contact_number);
    } catch (error) {
      console.error("Customer ID not found:", error);
      toast.error("Customer ID not found");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    navigate(`/booking?serviceId=${service.id}`);
    console.log(selectedService);
    setSelectedService(service);
  };

  return (
    <div className="container mt-5">
      <section className="container items">
        <h1 className="fs-700 ff-serif text-center">Booking</h1>
        <hr />
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Day</h2>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>
        <hr />
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Time</h2>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <hr />
        <Service
          title="Select Services"
          isBookingPage={true}
          onServiceSelect={handleServiceSelect}
          currentDate={currentDate}
          preselectedServiceId={serviceId}
        />
        <hr />
        <div className="container">
          <h2 className="fs-600 ff-serif">Fill up Information</h2>
          <div className="row">
            <div className="col-md-6">
              <form>
                {renderInput("Name", "text", name, setName, "Enter your name")}
                {renderInput(
                  "Email address",
                  "email",
                  email,
                  setEmail,
                  "Enter email"
                )}
                {renderInput(
                  "Contact Number",
                  "text",
                  contactNumber,
                  setContactNumber,
                  "Enter contact number"
                )}
              </form>
            </div>
            <div className="panel-2 col-md-6">
              <div className="card">
                <h1 className="pb-3">Have you got a 15-day pass?</h1>
                <div>
                  <button className="btn btn-primary-clr">Use</button>
                  <button className="btn btn-secondary-clr">Learn more</button>
                </div>
              </div>
              <form onSubmit={handleUseCustomerID}>
                {renderInput(
                  "Use your Customer ID?",
                  "text",
                  customerID,
                  setCustomerID,
                  "Enter Customer ID",
                  false
                )}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary-clr"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner text="Loading..." /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <hr />
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Payment Method</h2>
          {["Bank Card", "GCash", "Pay on Counter"].map((method) => (
            <div key={method}>
              <input
                type="radio"
                className="btn-check"
                name="paymentMethod"
                id={method.replace(" ", "").toLowerCase()}
                autoComplete="off"
                value={method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label
                className="btn btn-secondary-clr mb-2"
                htmlFor={method.replace(" ", "").toLowerCase()}
              >
                {method}
              </label>
            </div>
          ))}
        </div>
        <div className="container text-center">
          <button
            className="btn btn-primary-clr"
            onClick={handleBookNowClick}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Processing..." /> : "Book Now!"}
          </button>
        </div>
      </section>
      <hr />
      <div className="container items">
        <h1 className="fs-700 ff-serif text-center">Check Booking</h1>
        <div className="container">
          <div className="mb-3">
            <label htmlFor="referenceNumber" className="form-label">
              Enter your reference number:
            </label>
            <input
              type="text"
              className="form-control"
              id="referenceNumber"
              placeholder="Enter Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="container text-center">
          <button
            className="btn btn-primary-clr"
            onClick={handleCheckBookingClick}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Checking..." /> : "Check Booking"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const renderInput = (
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true
) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

const LoadingSpinner = ({ text }) => (
  <>
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />{" "}
    {text}
  </>
);

export default Book;
