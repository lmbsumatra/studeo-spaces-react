// Book.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const Book = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [customerID, setCustomerID] = useState("");

  const navigate = useNavigate();

  const handleBookNowClick = () => {
    console.log('Selected Service:', selectedService);
    console.log('Date:', date);
    console.log('Time:', time);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Contact Number:', contactNumber);
    console.log('Payment Method:', paymentMethod);

    const bookingDetails = {
      service: selectedService,
      date,
      time,
      name,
      email,
      contact_number: contactNumber,
      payment_method: paymentMethod,
      customerID: customerID, // Include customerID here
    };

    navigate('/confirmation', { state: bookingDetails });
  };

  const handleCheckBookingClick = () => {
    if (referenceNumber) {
      navigate("/booking-details", { state: { referenceNumber } });
    } else {
      alert("Please enter a valid reference number.");
    }
  };

  const handleUseCustomerID = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/${customerID}`);
      const customer = response.data;
      setName(customer.name);
      setEmail(customer.email);
      setContactNumber(customer.contact_number);
    } catch (error) {
      console.error('Customer ID not found:', error);
      alert("Customer ID not found");
    }
  };

  return (
    <div className="container">
      {/* Booking Section */}
      <section className="container items">
        <h1 className="fs-700 ff-serif text-center">Booking</h1>

        {/* Select service */}
        <div className="container" id="services">
          <h2 className="fs-600 ff-serif">Select Service</h2>
          <div className="d-flex justify-content-around">
            {[1, 2, 3].map((i) => (
              <div className="card" style={{ width: "18rem" }} key={i}>
                <label htmlFor={`service${i}`}>
                  <img
                    src="../assets/images/img_1.jpg"
                    className="card-img-top"
                    alt="Service"
                  />
                  <div className="card-body">
                    <h5 className="card-title fs-500 ff-serif">
                      All day/All night Pass
                    </h5>
                    <p className="card-text fs-500">₱ 250.00</p>
                    <input
                      type="radio"
                      className="btn-check"
                      name="service"
                      id={`service${i}`}
                      autoComplete="off"
                      onChange={() => setSelectedService(`Service ${i}`)}
                    />
                    <label
                      className="btn btn-secondary-clr"
                      htmlFor={`service${i}`}
                    >
                      Select
                    </label>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

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
            <div className="col-md-6">
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
                  <button type="submit" className="btn btn-primary-clr">
                    Submit
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
              value="Hand On"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="btn btn-secondary-clr" htmlFor="handOn">
              Cash on Delivery
            </label>
          </div>
        </div>

        <div className="container text-center">
          <button className="btn btn-primary-clr" onClick={handleBookNowClick}>
            Book Now!
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
          <button className="btn btn-primary-clr" onClick={handleCheckBookingClick}>
            Check Booking
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Book;
