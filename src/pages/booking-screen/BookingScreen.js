import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer";
import Service from "../../components/services/Service";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import "./style.css";
import Promo from "../../components/promo/Promo";
import { baseApiUrl } from "../../App";
import infoIcon from "../../assets/images/icons/info.svg";

import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal
import logo from "../../assets/images/studeo-spaces-logo.jpg";

const Book = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [errorTime, setErrorTime] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errorContactNumber, setErrorContactNumber] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = location.state;
  const [isUserIdPolicyOpen, setUserIdPolicyOpen] = useState(false);

  //15 DAY PASS
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [passID, setPassID] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});

  useEffect(() => {
    const now = new Date();
    const selectedDateTime = new Date(`${currentDate}T${time}`);

    if (selectedDateTime <= new Date(now.getTime() - 60 * 60 * 1000)) {
      setErrorTime(true);
    } else {
      setErrorTime(false);
    }
  }, [currentDate, time]);

  const handleContactNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setContactNumber(value);
    const isValid = /^\d{11}$/.test(value); // Validate the updated value
    setErrorContactNumber(!isValid);
  };

  const handleOpenUserIdPolicy = () => {
    setUserIdPolicyOpen(!isUserIdPolicyOpen);
    console.log(isUserIdPolicyOpen);
  };

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
            `${baseApiUrl}services/${serviceId}`
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
        `${baseApiUrl}bookings/${referenceNumber}`
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
        `${baseApiUrl}customers/${customerID}`
      );
      setName(customer.name);
      setEmail(customer.email);
      setContactNumber(customer.contact_number);
    } catch (error) {
      setName("");
      setEmail("");
      setContactNumber("");
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

  //15 DAY PASS
  const handleClosePassModal = () => setShowPassModal(false);
  const handleShowPassModal = () => setShowPassModal(true);

  const handleCloseCardModal = () => setShowCardModal(false);
  const handleShowCardModal = () => setShowCardModal(true);

  const handleCheckPass = async () => {
    try {
      const response = await axios.post(`${baseApiUrl}check-pass`, {
        customer_id: customerID,
        pass_id: passID,
      });
      setPassID(response.data.pass);
      setCustomerDetails(response.data.customer); // Store customer details
      handleShowCardModal();
    } catch (error) {
      console.error("Error checking pass:", error);
      toast.error(error.response?.data?.error || "Error checking pass");
      handleClosePassModal();
    } finally {
      setLoading(false);
    }
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
            min={new Date().toISOString().split("T")[0]}
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
          {errorTime && (
            <p className="text-danger">
              Please select a time at least one hour from now.
            </p>
          )}
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
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errorContactNumber ? "is-invalid" : ""
                    }`}
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                  />
                  {errorContactNumber && (
                    <div className="invalid-feedback">
                      Contact number must be exactly 11 digits and contain only
                      numbers.
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="panel-2 col-md-6">
              <div className="card">
                <h1 className="pb-3">Have you got a 15-day pass?</h1>
                <div>
                  <button
                    className="btn btn-primary-clr"
                    onClick={handleShowPassModal}
                  >
                    Use
                  </button>
                  <button className="btn btn-secondary-clr">Learn more</button>
                </div>
              </div>
              <form onSubmit={handleUseCustomerID} className="information">
                {renderInput(
                  <div className="input userId">
                    Use your Customer ID?{" "}
                    <img
                      src={infoIcon}
                      className="info icon"
                      onClick={handleOpenUserIdPolicy}
                    />
                  </div>,
                  "text",
                  customerID,
                  setCustomerID,
                  "Enter Customer ID",
                  false
                )}
                <div
                  className={`info userId policy ${
                    isUserIdPolicyOpen === true ? "active" : ""
                  }`}
                >
                  <p className="fs-small">
                    If you have registered already, Customer ID is provided to
                    automatically fill the form with your personal details.
                    Review our <a href="#" className="light-blue">Privacy Policy</a> about your information usage.
                  </p>
                </div>

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
        {/* POP UP 15 DAY PASS */}
        <Modal show={showPassModal} onHide={handleClosePassModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Use 15 Day Pass
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label className="form-label">Enter Pass ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Pass ID"
                  value={passID}
                  onChange={(e) => setPassID(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Enter your Customer ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Customer ID"
                  value={customerID}
                  onChange={(e) => setCustomerID(e.target.value)}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary-clr"
              onClick={handleClosePassModal}
            >
              Close
            </button>
            <button className="btn btn-primary-clr" onClick={handleCheckPass}>
              Check
            </button>
          </Modal.Footer>
        </Modal>
        {/* POP UP 15 DAY PASS END*/}

        {/* POP UP CARD */}
        <Modal show={showCardModal} onHide={handleCloseCardModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Card Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <div className="pass">
              <div className="header d-flex">
                <div>
                  <img src={logo} height="40px" alt="Logo" />
                </div>
                <div>Studeo Spaces</div>
              </div>
              <div className="body">
                <div className="center d-flex">
                  <div className="bullets-1">
                    <div className="bullet">1</div>
                    <div className="bullet">2</div>
                    <div className="bullet">3</div>
                    <div className="bullet">4</div>
                    <div className="bullet">5</div>
                  </div>
                  <div className="user-id text-center">
                    <div className="id-picture"></div>
                    <div className="name title">Name</div>
                    <div className="name sub-title">
                      {customerDetails?.name || "N/A"}
                    </div>
                    <div className="id title">ID No.</div>
                    <div className="id sub-title">
                      {customerDetails?.id || "N/A"}
                    </div>
                    <div className="address title">Address</div>
                    <div className="address sub-title">
                      {customerDetails?.address || "N/A"}
                    </div>
                    <div className="contactNo title">Contact No.</div>
                    <div className="contactNo sub-title">
                      {customerDetails?.contactNo || "N/A"}
                    </div>
                  </div>
                  <div className="bullets-1">
                    <div className="bullet">11</div>
                    <div className="bullet">12</div>
                    <div className="bullet">13</div>
                    <div className="bullet">14</div>
                    <div className="bullet">15</div>
                  </div>
                </div>
                <div className="bottom bullets-2 d-flex justify-content-between">
                  <div className="bullet">6</div>
                  <div className="bullet">7</div>
                  <div className="bullet">8</div>
                  <div className="bullet">9</div>
                  <div className="bullet">10</div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary-clr"
              onClick={() => {
                setShowCardModal(false); // Close the card modal
                setShowPassModal(true); // Open the "15 Day Pass" modal
              }}
            >
              Close
            </button>
            <button className="btn btn-primary-clr" onClick={handleCheckPass}>
              Share
            </button>
            <button className="btn btn-primary-clr" onClick={handleCheckPass}>
              Use
            </button>
          </Modal.Footer>
        </Modal>

        {/* POP UP CARD END */}
        {/* Select Payment Method */}
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
