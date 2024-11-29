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
import PassCard from "../../components/pass/passCard";

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
  const [isOwner, setIsOwner] = useState(true);
  const [passReference, setPassReference] = useState("");
  const [passDetails, setPassDetails] = useState(null);
  const [shareMode, setShareMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedUserInfo, setSharedUserInfo] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [contact, setContact] = useState("");
  const [remainingBullets, setRemainingBullets] = useState(
    passDetails?.remaining_bullets ?? 15
  );
  const [remainingBulletsState, setRemainingBulletsState] = useState(15);

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
    let seat_code = "";
    const bookingDetails = {
      service_id: selectedService.id,
      service_name: selectedService.name, // Pass the service name
      price: selectedService.price,
      currentDate,
      time,
      name,
      email,
      contact_number: contactNumber,
      payment_method: paymentMethod,
      customerID,
      seat_code,
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

  const handleShowShareModal = () => {
    if (passDetails?.pass?.reference_number) {
      setShowShareModal(true);
      setShowCardModal(false);
    } else {
      toast.error("No pass details available to share");
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleCopyReferenceNumber = () => {
    if (passDetails?.pass?.reference_number) {
      navigator.clipboard
        .writeText(passDetails.pass.reference_number)
        .then(() => {
          toast.success("Reference number copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy reference number");
        });
    }
  };

  const handleCheckPass = async () => {
    setLoading(true);
    try {
      const payload = isOwner
        ? { customer_id: customerID, pass_id: passID }
        : {
            reference_number: referenceNumber,
            name: name,
            email: email,
            contact: contact,
          };

      const url = isOwner
        ? `${baseApiUrl}check-pass`
        : `${baseApiUrl}check-pass-by-reference`;

      const response = await axios.post(url, payload);

      console.log("API Response (Check Pass):", response.data);

      if (response.data.success) {
        setPassID(response.data.pass.pass_id || "");
        console.log("Pass ID:", passID);

        setPassDetails({
          customer: response.data.customer,
          pass: response.data.pass,
        });
        setCustomerDetails(response.data.customer);
        setRemainingBullets(response.data.pass.remaining_bullets); // Update remainingBullets state
        handleShowCardModal();
      }

      console.log("API Response:", response.data);
      console.log("Request Payload:", payload); // Log the request payload
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error);
      toast.error(error.response?.data?.error || "Error checking pass");
    } finally {
      setLoading(false);
      handleClosePassModal();
    }
  };

  const handleUsePass = async () => {
    if (!passDetails || !passDetails.customer || !passDetails.pass) {
      toast.error("Pass details are missing. Please try again.");
      return;
    }

    const referenceNumberToUse = passDetails.pass.reference_number;

    if (!referenceNumberToUse) {
      toast.error("Reference number is missing. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Share Mode:", shareMode);
      console.log("Pass Details:", passDetails);

      let userData = {};

      if (!isOwner) {
        userData = {
          user_name: name,
          user_email: email,
          user_contact: contact,
        };
      } else {
        userData = {
          user_name: passDetails.customer.name,
          user_email: passDetails.customer.email,
          user_contact: passDetails.customer.contact_number,
        };
      }

      const payload = {
        reference_number: referenceNumberToUse,
        name: userData.user_name,
        email: userData.user_email,
        contact_number: userData.user_contact,
      };

      const response = await axios.post(`${baseApiUrl}use-pass`, payload);
      console.log("API Response:", response.data);

      toast.success("Pass used successfully!");

      // Update remaining bullets from response data
      if (response.data.remaining_bullets >= 0) {
        setRemainingBullets(response.data.remaining_bullets); // Update global state
        setRemainingBulletsState(response.data.remaining_bullets); // Update local state
      }

      if (shareMode) {
        setShareMode(false);
        setSharedUserInfo({
          name: "",
          email: "",
          contact: "",
        });
      }
    } catch (error) {
      console.error("Error using pass:", error.response?.data?.error || error);
      toast.error(error.response?.data?.error || "Error using pass");
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
                    Review our{" "}
                    <a href="#" className="light-blue">
                      Privacy Policy
                    </a>{" "}
                    about your information usage.
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

        {/* Pass Modal */}
        <Modal show={showPassModal} onHide={handleClosePassModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Use 15 Day Pass
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              {/* Toggle Checkbox */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={!isOwner}
                  onChange={(e) => setIsOwner(!e.target.checked)} // Update isOwner accordingly
                />
                <label className="form-check-label">
                  Use with reference number
                </label>
              </div>

              {/* Conditional Rendering */}
              {isOwner ? (
                // Owner's view: Customer ID and Pass ID fields
                <>
                  <div className="mb-3">
                    <label className="form-label">Enter Customer ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Customer ID"
                      value={customerID}
                      onChange={(e) => setCustomerID(e.target.value)}
                    />
                  </div>
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
                </>
              ) : (
                // Non-owner's view: Reference number and personal details
                <>
                  <div className="mb-3">
                    <label className="form-label">Enter Reference Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Reference Number"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter Your Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Enter Your Contact Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Contact Number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </>
              )}
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

        {/* Card Modal */}
        <Modal show={showCardModal} onHide={handleCloseCardModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Card Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <PassCard
              customerDetails={customerDetails}
              passDetails={{
                ...passDetails,
                remaining_bullets: remainingBullets,
              }}
              logo={logo}
              onUse={handleUsePass}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary-clr"
              onClick={() => {
                setShowCardModal(false);
                setShowPassModal(true);
              }}
            >
              Close
            </button>
            <button
              className="btn btn-primary-clr"
              onClick={handleShowShareModal}
            >
              Share
            </button>
            <button className="btn btn-primary-clr" onClick={handleUsePass}>
              Use
            </button>
          </Modal.Footer>
        </Modal>

        {/* Share Modal */}
        <Modal show={showShareModal} onHide={handleCloseShareModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Share Pass Reference Number
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-4">
              <h5>Your Pass Reference Number</h5>
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <input
                  type="text"
                  className="form-control text-center"
                  value={passDetails?.pass?.reference_number || ""}
                  readOnly
                  style={{ maxWidth: "300px" }}
                />
                <button
                  className="btn btn-primary-clr"
                  onClick={handleCopyReferenceNumber}
                >
                  Copy
                </button>
              </div>
              <p className="text-muted">
                Share this reference number with others to let them use your
                pass. They will need to provide their own details when using the
                pass.
              </p>
              {/* Display remaining days and bullets */}
              <div className="mt-3">
                <p className="mb-2">Pass Status:</p>
                <p className="mb-1">
                  Remaining Days: {passDetails?.pass?.remaining_days || 0}
                </p>
                <p>
                  Remaining Bullets: {passDetails?.pass?.remaining_bullets || 0}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary-clr"
              onClick={() => {
                handleCloseShareModal();
                setShowCardModal(true);
              }}
            >
              Back to Card
            </button>
            <button
              className="btn btn-primary-clr"
              onClick={handleCopyReferenceNumber}
            >
              Copy Reference Number
            </button>
          </Modal.Footer>
        </Modal>

        {/* Payment Method Section */}
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
