import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [sortedBookings, setSortedBookings] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/bookings");
        setBookings(response.data);
        const initialStatuses = response.data.reduce((acc, booking) => {
          acc[booking.id] = booking.status;
          return acc;
        }, {});
        setStatuses(initialStatuses);
        sortBookings(response.data, sortOption);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [sortOption]);

  const sortBookings = (data, option) => {
    let sortedData = [...data];

    if (option === "dateAscend") {
      sortedData = sortedData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (option === "dateDescend") {
      sortedData = sortedData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    setSortedBookings(sortedData);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    setSortOption(value);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [bookingId]: newStatus,
      }));

      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        console.log("Booking status updated successfully");

        if (newStatus === "Completed") {
          const bookingDetails = bookings.find(
            (booking) => booking.id === bookingId
          );

          const paymentData = {
            customerName: bookingDetails.customer?.name,
            amount: bookingDetails.service?.price,
            date: bookingDetails.date,
          };

          const paymentResponse = await axios.post(
            "http://127.0.0.1:8000/api/payments",
            paymentData
          );

          if (paymentResponse.status === 201) {
            console.log("Payment added successfully");
          } else {
            throw new Error("Failed to add payment");
          }
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [bookingId]: prevStatuses[bookingId],
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bookings</h1>
      <div className="row mb-3">
        <div className="col">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="form-control form-control-sm"
          >
            <option value="default">Default</option>
            <option value="dateAscend">Date (Ascending)</option>
            <option value="dateDescend">Date (Descending)</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <p>No bookings to show</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Booking ID</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Service</th>
                <th scope="col">Payment</th>
                <th scope="col">Time</th>
                <th scope="col">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map((booking) => (
                <tr key={booking.id}>
                  <th scope="row">{booking.id}</th>
                  <td>{booking.customer?.name}</td>
                  <td>{booking.service?.name}</td>
                  <td>{booking.service?.price}</td>
                  <td>{booking.time}</td>
                  <td>
                    <select
                      value={statuses[booking.id] || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
