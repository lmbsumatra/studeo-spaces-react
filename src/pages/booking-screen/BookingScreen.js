import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer";
import Service from "../../components/services/Service";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner component
import { toast } from "react-toastify";
import "./style.css";
import Promo from "../../components/promo/Promo";

const Book = () => {
  // State declarations
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const location = useLocation();
  // Extract URL parameters
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get("serviceId");

  useEffect(() => {
    // Set initial date and time if serviceId is present
    if (serviceId) {
      const now = new Date();
      setDate(now.toISOString().split("T")[0]); // YYYY-MM-DD
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      // Set selected service for auto-selection
      setSelectedService(serviceId);
    }
  }, [location.search]);

  // Event handler for booking
  const handleBookNowClick = async () => {
    // Check if all required fields are filled
    if (
      !selectedService ||
      !date ||
      !time ||
      !name ||
      !email ||
      !contactNumber ||
      !paymentMethod
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare booking details
    const bookingDetails = {
      service_id: selectedService.id,
      price: selectedService.price,
      date,
      time,
      name,
      email,
      contact_number: contactNumber,
      payment_method: paymentMethod,
      customerID: customerID,
    };

    setLoading(true); // Set loading to true

    try {
      // Simulate a delay to show loading spinner (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/confirmation", { state: bookingDetails });
    } catch (error) {
      console.error("Error booking:", error);
      alert("Error booking. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Event handler for checking bookings
  const handleCheckBookingClick = async () => {
    setLoading(true); // Set loading to true

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/${referenceNumber}`
      );
      if (response.data.message) {
        alert(response.data.message);
      } else {
        navigate("/booking-details", { state: { referenceNumber } });
      }
    } catch (error) {
      console.error("Error checking booking:", error);
      toast.error("Error: Invalid Booking Id");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Event handler for using customer ID
  const handleUseCustomerID = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/customers/${customerID}`
      );
      const customer = response.data;
      setName(customer.name);
      setEmail(customer.email);
      setContactNumber(customer.contact_number);
    } catch (error) {
      console.error("Customer ID not found:", error);
      toast.error("Customer ID not found");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Callback function to handle service selection
  const handleServiceSelect = (service) => {
    navigate(`/booking`);
    setSelectedService(service);
  };

  return (
    <div className="container mt-5">
      <section className="container items">
        <h1 className="fs-700 ff-serif text-center">Booking</h1>
        <hr />
        {/* Select date */}
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Day</h2>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <hr />
        {/* Select Time */}
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Time</h2>
          <input
            type="time"
            name="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <hr />
        {/* Select service */}
        <Service
          title="Select Services"
          isBookingPage={true}
          onServiceSelect={handleServiceSelect}
          date={date}
          preselectedServiceId={serviceId} // Pass preselected service ID
        />
        <hr />
        {/* Fill out information */}
        <div className="container">
          <h2 className="fs-600 ff-serif">Fill up Information</h2>
          <div className="row">
            <div className="col-md-6">
              <form action="#" method="POST">
                <div className="mb-3">
                  <label htmlFor="exampleInputName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputName"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputContactNumber"
                    className="form-label"
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputContactNumber"
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="panel-2 col-md-6">
              <div className="card">
                <h1 className="pb-3">
                  Have you got 15 day pass?
                </h1>
                <div>
                <button className="btn btn-primary-clr">Use</button>
                <button className="btn btn-secondary-clr">Learn more</button>
                </div>
                
              </div>
              <form onSubmit={handleUseCustomerID}>
                <div className="mb-3">
                  <label htmlFor="customerID" className="form-label">
                    Use your Customer ID?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerID"
                    placeholder="Enter Customer ID"
                    value={customerID}
                    onChange={(e) => setCustomerID(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary-clr"
                    disabled={loading}
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
                        Loading...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <hr />
        {/* Select Payment Method */}
        <div className="container">
          <h2 className="fs-600 ff-serif">Select Payment Method</h2>
          <div>
            <input
              type="radio"
              className="btn-check"
              name="paymentMethod"
              id="bankCard"
              autoComplete="off"
              value="Bank Card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="btn btn-secondary-clr mb-2" htmlFor="bankCard">
              Bank Card
            </label>
          </div>
          <div>
            <input
              type="radio"
              className="btn-check"
              name="paymentMethod"
              id="gcash"
              autoComplete="off"
              value="GCash"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="btn btn-secondary-clr mb-2" htmlFor="gcash">
              GCash
            </label>
          </div>
          <div>
            <input
              type="radio"
              className="btn-check"
              name="paymentMethod"
              id="handOn"
              autoComplete="off"
              value="Pay on Counter"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="btn btn-secondary-clr" htmlFor="handOn">
              Pay on Counter
            </label>
          </div>
        </div>
        <div className="container text-center">
          <button
            className="btn btn-primary-clr"
            onClick={handleBookNowClick}
            disabled={loading}
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
                Processing...
              </>
            ) : (
              "Book Now!"
            )}
          </button>
        </div>
      </section>
      <hr />
      {/* Reference Number Section */}
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
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Checking...
              </>
            ) : (
              "Check Booking"
            )}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Book;
