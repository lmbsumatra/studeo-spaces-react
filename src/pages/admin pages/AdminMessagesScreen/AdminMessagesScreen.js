// AdminMessagesScreen.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../../../App";
import { formatDate } from "../../../utils/dateFormat";

const AdminMessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseApiUrl}messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Messages</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <p>No new messages</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Name</th>
                <th>Message</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.email}</td>
                  <td>{msg.name}</td>
                  <td>{msg.message}</td>
                  <td>{formatDate(msg.created_at)}</td>
                  <td>{msg.message_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesScreen;
