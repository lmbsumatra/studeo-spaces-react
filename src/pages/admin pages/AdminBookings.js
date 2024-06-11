import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/bookings');
        setBookings(response.data);
        const initialStatuses = response.data.reduce((acc, booking) => {
          acc[booking.id] = booking.status; // Initialize with actual status
          return acc;
        }, {});
        setStatuses(initialStatuses);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setStatuses(prevStatuses => ({
        ...prevStatuses,
        [bookingId]: newStatus,
      }));

      const response = await axios.put(`http://127.0.0.1:8000/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        console.log('Booking status updated successfully');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      // Revert to previous status if the request fails
      setStatuses(prevStatuses => ({
        ...prevStatuses,
        [bookingId]: prevStatuses[bookingId],
      }));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings to show</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Booking ID</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <th scope="row">{booking.id}</th>
                  <td>{booking.customer?.name}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>
                    <select
                      value={statuses[booking.id] || 'Pending'}
                      onChange={e => handleStatusChange(booking.id, e.target.value)}
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
