// AdminMessagesScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMessagesScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from the backend API when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="container mt-5">
      <h1 className='mb-4'>Messages</h1>
      {messages.length === 0 ? (
        <p>No new messages</p> // display this if there no message
      ) : (
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
                <td>{new Date(msg.created_at).toLocaleString()}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMessagesScreen;
