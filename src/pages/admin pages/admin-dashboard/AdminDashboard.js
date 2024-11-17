import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./adminDashboardStyles.css";
import { baseApiUrl } from "../../../App";
import { formatTimeTo12Hour } from "../../../utils/timeFormat";
import BookingChart from "../../../components/charts/BookingChart";
import { useNavigate } from "react-router-dom";
import userImg from "../../../assets/images/icons/user.svg";
import UserGrowthChart from "../../../components/charts/UserGrowthChart";
import mail from "../../../assets/images/icons/mail.svg";
import MessageCarousel from "../../../components/MessagesCarousel";
import FeedbackCarousel from "../../../components/FeedbackCarousel";

const AdminDashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date()); // Set initial date to today's date
  const [data, setData] = useState({
    availableSeats: 0,
    bookedSeats: 0,
    numberOfCustomers: 0,
    totalSales: 0,
    pendingBookings: 0,
    canceledBookings: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [topCustomersData, setTopCustomersData] = useState([]);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchData(date);
        await fetchBookingChartData();
        await fetchBookings();
        await fetchTopCustomersData();
        await fetchMessages();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [date]);

  const fetchData = async (selectedDate) => {
    const formattedDate = selectedDate.toLocaleDateString("en-CA");
    try {
      const response = await axios.get(
        `${baseApiUrl}admin-dashboard-data?date=${formattedDate}`
      );
      setData(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const fetchBookingChartData = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}booking-chart-data`);
      setBookingChartData(response.data);
    } catch (error) {
      console.error("There was an error fetching the bookings!", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}bookings`);
      setBookings(response.data.slice(0, 4));
    } catch (error) {
      console.error("There was an error fetching the bookings!", error);
    }
  };

  const handleViewAll = (url) => {
    navigate(url);
  };

  const fetchTopCustomersData = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}top-customers-data`);
      const sortedData = response.data.sort(
        (a, b) => b.total_bookings - a.total_bookings
      ); // Sort in descending order
      setTopCustomersData(sortedData);
    } catch (error) {
      console.log("There was an error getting top customers!", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}messages`);
      setMessages(response.data);
    } catch (error) {
      console.log("There was an error getting messages!", error);
    }
  };

  const renderSpinner = () => (
    <div className="spinner-border spinner-border-sm" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
    <div className="container mt-5" id="dashboard">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="container mb-2">
        <h2 className="fs-600 ff-serif">Select Day</h2>
      </div>

      {/* Overall booking overview */}
      <div className="row">
        {/* col 1 */}
        <div className="col-12 col-md-6 col-lg-3 d-flex flex-column mb-3">
          <Calendar onChange={setDate} value={date} className="calendar" />
        </div>

        {/* col 2 */}
        <div className="d-block col-12 col-md-6 col-lg-3 d-flex flex-column mb-3">
          <div className="flex-fill mb-2">
            <div className="card text-white bg-primary h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Available Seats</h5>
                <p className="card-text fs-3">
                  {isLoading ? renderSpinner() : data.availableSeats}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-fill mb-2">
            <div className="card text-white bg-success h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Booked Seats</h5>
                <p className="card-text fs-3">
                  {isLoading ? renderSpinner() : data.bookedSeats}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* col 3 */}
        <div className="d-block col-12 col-md-6 col-lg-3 d-flex flex-column mb-3">
          <div className="flex-fill mb-2">
            <div className="card text-white bg-info h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Customers</h5>
                <p className="card-text fs-3">
                  {isLoading ? renderSpinner() : data.numberOfCustomers}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-fill mb-2">
            <div className="card text-white bg-warning h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Total Sales</h5>
                <p className="card-text fs-3">
                  {isLoading
                    ? renderSpinner()
                    : `₱ ${data.totalSales.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* col 4 */}
        <div className="d-block col-12 col-md-6 col-lg-3 d-flex flex-column mb-3">
          <div className="flex-fill mb-2">
            <div className="card text-white bg-danger h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Pending Bookings</h5>
                <p className="card-text fs-3">
                  {isLoading ? renderSpinner() : data.pendingBookings}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-fill mb-2">
            <div className="card text-white bg-secondary h-100 w-100">
              <div className="card-body">
                <h5 className="card-title">Canceled Bookings</h5>
                <p className="card-text fs-3">
                  {isLoading ? renderSpinner() : data.canceledBookings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="fs-600">Studeo Spaces Statistics</div>

      {/* Bookings Statistics */}
      <div className="container stats">
        <div className="row">
          <div className="table-responsive col-lg-6">
            <h2 className="fs-600 ff-serif">Upcoming Bookings</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Service</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? renderSpinner()
                  : bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customer?.name}</td>
                        <td>{booking.service?.name}</td>
                        <td>{booking.service?.price}</td>
                        <td>{formatTimeTo12Hour(booking.time)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <button
              className="btn btn-primary"
              onClick={() => handleViewAll("/admin/bookings")}
            >
              View All Bookings →
            </button>
          </div>
          <div className="col-lg-6">
          <h2 className="fs-600 ff-serif">Number of bookings</h2>
            {isLoading ? renderSpinner() : <BookingChart data={bookingChartData} />}
          </div>
        </div>
      </div>

      {/* Customers Statistics */}
      <div className="container stats">
        <div className="row p-2">
          <div className="top-customer-container rounded col-12 col-lg-4">
            <h2 className="fs-600 ff-serif">Top Customers</h2>

            {/* Display top customer */}
            <div className="top-customer customer">
              {topCustomersData[0] ? (
                <div>
                  <img
                    src={userImg}
                    className="top"
                    alt={topCustomersData[0].customer_name}
                  />
                  <p className="ff-serif">
                    {topCustomersData[0].customer_name}
                  </p>
                  <p>{topCustomersData[0].total_bookings}</p>
                </div>
              ) : (
                renderSpinner()
              )}
            </div>

            {/* Display last two customers side by side */}
            <div className="customers">
              {topCustomersData.slice(1).map((customer) => (
                <div key={customer.customer_id} className="customer">
                  <img src={userImg} alt={customer.customer_name} />
                  <p className="ff-serif">{customer.customer_name}</p>
                  <p>{customer.total_bookings}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-8 col-12 pt-2">
            <div className="d-flex justify-content-between">
              <h2 className="fs-600 ff-serif">New Users</h2>
              <button
                className="btn btn-primary h-25"
                onClick={() => handleViewAll("/admin/customers")}
              >
                View All Customers →
              </button>
            </div>

            {isLoading ? renderSpinner() : <UserGrowthChart />}
          </div>
        </div>
      </div>

      {/* Message Overview */}
      <div className="container stats">
        <h2 className="fs-600 ff-serif">Message Overview</h2>
        <div className="row p-4">
          {/* Urgent */}
          <div className="stat-card text-white bg-danger rounded p-2">
            <h2 className="fs-600 ff-serif">Needs Attention</h2>
            <div>
              {isLoading ? renderSpinner() : messages.length === 0 ? (
                <p>No Messages</p>
              ) : (
                <MessageCarousel messages={messages} style={{ height: "50px" }} />
              )}
            </div>
          </div>
          {/* Feedback */}
          <div className="stat-card bg-dark text-white rounded p-2">
            <h2 className="fs-600 ff-serif">Review Feedbacks</h2>
            <div>
              {isLoading ? renderSpinner() : messages.length === 0 ? (
                <p>No Feedback Available</p>
              ) : (
                <FeedbackCarousel style={{ height: "50px" }} />
              )}
            </div>
          </div>
          {/* New Messages */}
          <div className="stat-card top-customer-container rounded p-2">
            <h2 className="fs-600 ff-serif">Recent Message</h2>
            <div>
              {isLoading ? renderSpinner() : messages.length > 0 ? (
                <div className="pb-3">
                  <img
                    src={mail}
                    className="d-flex justify-content-center"
                    style={{ height: "50px" }}
                  />
                  <h3>
                    {messages[messages.length - 1].message_type ||
                      "No message type"}
                  </h3>
                  <p>
                    From:{" "}
                    {messages[messages.length - 1].name || "Unknown sender"}
                  </p>
                  <p>
                    {messages[messages.length - 1].message ||
                      "No message content"}
                  </p>
                  <div className="d-flex w-100 justify-content-between">
                    <button className="btn btn-warning text-white">
                      Mark as read
                    </button>
                    <button className="btn btn-outline-danger bg-light text-danger">
                      Delete
                    </button>
                    <button className="btn btn-primary text-white">View</button>
                  </div>
                </div>
              ) : (
                <p>No messages available</p>
              )}
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary h-25 d-block"
          onClick={() => handleViewAll("/admin/messages")}
        >
          View All Messages →
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
