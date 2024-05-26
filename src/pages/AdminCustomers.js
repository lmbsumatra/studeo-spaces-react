import React from 'react';
// import './AdminCustomers.css'; // Optional: for custom styles

const AdminCustomers = () => {
  // Sample data for demonstration purposes
  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      contactNumber: '1234567890',
      bookings: [
        { referenceNumber: 'REF123', date: '2024-06-01', status: 'Confirmed' },
        { referenceNumber: 'REF124', date: '2024-06-10', status: 'Pending' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      contactNumber: '0987654321',
      bookings: [
        { referenceNumber: 'REF125', date: '2024-06-05', status: 'Cancelled' }
      ]
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Customers</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Customer ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Contact Number</th>
              <th scope="col">Number of Bookings</th>
              <th scope="col">Reference Numbers</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <th scope="row">{customer.id}</th>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.contactNumber}</td>
                <td>{customer.bookings.length}</td>
                <td>
                  {customer.bookings.map(booking => (
                    <div key={booking.referenceNumber}>
                      {booking.referenceNumber} ({booking.status})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomers;
