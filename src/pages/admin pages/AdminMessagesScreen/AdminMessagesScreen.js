import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../../../App";
import { formatDate } from "../../../utils/dateFormat";
import PaginationComponent from "../../../components/PaginationComponent";

const AdminMessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 items per page


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

  useEffect(() => {
    // Sorting and searching logic
    let sortedData = [...messages];

    // Apply search filter
    if (searchQuery) {
      sortedData = sortedData.filter(
        (msg) =>
          msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (selectedDate) {
      sortedData = sortedData.filter((msg) => {
        const messageDateOnly = new Date(msg.created_at)
          .toISOString()
          .split("T")[0];
        return messageDateOnly === selectedDate;
      });
    }

    // Sorting logic
    if (sortConfig.key && sortConfig.direction) {
      sortedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setSortedMessages(sortedData);
  }, [messages, searchQuery, sortConfig, selectedDate]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDate("");
    setSortConfig({ key: "", direction: "" });
  };

// Calculate the indices of the first and last messages on the current page
const indexOfLastMessage = currentPage * itemsPerPage;
const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;

// Pagination logic: slice the sortedMessages array
const currentMessages = sortedMessages.slice(indexOfFirstMessage, indexOfLastMessage);
const totalPages = Math.ceil(sortedMessages.length / itemsPerPage);


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Messages</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Email or Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Date filter */}
      <div className="mb-4 d-flex align-items-center">
        <input
          type="date"
          className="form-control w-auto"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <button className="btn btn-secondary mt-0 ms-2" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : sortedMessages.length === 0 ? (
        <p>No messages to show</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  <div className="d-flex justify-content-between align-items-center">
                    #
                    <select
                      onChange={(e) => handleSortChange("id", e.target.value)}
                      className="form-control form-control-sm w-auto"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </th>
                <th scope="col">
                  <div className="d-flex justify-content-between align-items-center">
                    Email
                    <select
                      onChange={(e) => handleSortChange("email", e.target.value)}
                      className="form-control form-control-sm w-auto"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </th>
                <th scope="col">
                  <div className="d-flex justify-content-between align-items-center">
                    Name
                    <select
                      onChange={(e) => handleSortChange("name", e.target.value)}
                      className="form-control form-control-sm w-auto"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </th>
                <th scope="col">Message</th>
                <th scope="col">
                  <div className="d-flex justify-content-between align-items-center">
                    Date
                    <select
                      onChange={(e) => handleSortChange("created_at", e.target.value)}
                      className="form-control form-control-sm w-auto"
                    >
                      <option value="">Sort</option>
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </th>
                <th scope="col">Type</th>
                <th scope="col">Action</th> {/* New column for action */}
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.email}</td>
                  <td>{msg.name}</td>
                  <td>{msg.message}</td>
                  <td>{formatDate(msg.created_at)}</td>
                  <td>{msg.message_type}</td>
                  <td>
                    {/* Reply button with mailto */}
                    <a
                      className="btn btn-link"
                      href={`mailto:${msg.email}?subject=Response&body=Hello, ${msg.name},%0A%0A`}
                    >
                      Reply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminMessagesScreen;
