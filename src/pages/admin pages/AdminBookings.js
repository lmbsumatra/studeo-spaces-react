import React from 'react';
// import './AdminBookings.css'; // Optional: for custom styles

const AdminBookings = () => {
  // Sample data for demonstration purposes
  const bookings = [
    { id: 1, customerName: 'John Doe', service: 'All day Pass', date: '2024-06-01', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, customerName: 'Jane Smith', service: 'Night Pass', date: '2024-06-02', time: '08:00 PM', status: 'Pending' },
    { id: 3, customerName: 'Alice Johnson', service: 'Day Pass', date: '2024-06-03', time: '02:00 PM', status: 'Cancelled' },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bookings</h1>
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
                <td>{booking.customerName}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;
