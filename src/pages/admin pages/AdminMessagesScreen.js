import React from 'react';

const AdminMessagesScreen = () => {
  // Sample static messages
  const messages = [
    {
      id: 1,
      email: 'example1@example.com',
      name: 'John Doe',
      message: 'Hello, I have a question about your services.',
      date: '2023-05-01',
    },
    {
      id: 2,
      email: 'example2@example.com',
      name: 'Jane Smith',
      message: 'Can you provide more information on your pricing?',
      date: '2023-05-02',
    },
    {
      id: 3,
      email: 'example3@example.com',
      name: 'Bob Johnson',
      message: 'I need help with my account.',
      date: '2023-05-03',
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className='mb-4'>Messages</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Name</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.id}</td>
              <td>{msg.email}</td>
              <td>{msg.name}</td>
              <td>{msg.message}</td>
              <td>{msg.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMessagesScreen;
