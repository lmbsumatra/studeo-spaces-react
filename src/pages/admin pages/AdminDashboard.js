import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Initialize date as a string
  const [data, setData] = useState({
    availableSeats: 0,
    bookedSeats: 0,
    numberOfCustomers: 0,
    totalSales: 0,
    pendingBookings: 0,
    canceledBookings: 0,
  });

  useEffect(() => {
    fetchData(date);
  }, [date]);

  const fetchData = (selectedDate) => {
    axios
      .get(`http://127.0.0.1:8000/api/admin-dashboard-data?date=${selectedDate}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  return (
    <div className="container mt-5" id="dashboard">
      
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="container">
        <h2 className="fs-600 ff-serif">Select Day</h2>
        <input
          type="date"
          name="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} // Correctly handle string value
        />
      </div>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Available Seats</h5>
              <p className="card-text fs-3">{data.availableSeats}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Booked Seats</h5>
              <p className="card-text fs-3">{data.bookedSeats}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-info h-100">
            <div className="card-body">
              <h5 className="card-title">Customers</h5>
              <p className="card-text fs-3">{data.numberOfCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text fs-3">
                ₱ {data.totalSales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Pending Bookings</h5>
              <p className="card-text fs-3">{data.pendingBookings}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-secondary h-100">
            <div className="card-body">
              <h5 className="card-title">Canceled Bookings</h5>
              <p className="card-text fs-3">{data.canceledBookings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
