import React from 'react';
// import './AdminPayments.css'; // Optional: for custom styles

const AdminPayments = () => {
  // Sample data for demonstration purposes
  const payments = [
    {
      id: 1,
      customerName: 'John Doe',
      amount: 250.00,
      date: '2024-06-01',
      status: 'Completed'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      amount: 150.00,
      date: '2024-06-05',
      status: 'Pending'
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Payments</h1>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Payment ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <th scope="row">{payment.id}</th>
                <td>{payment.customerName}</td>
                <td>₱{payment.amount.toFixed(2)}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPayments;
