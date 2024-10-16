import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../../App";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [sortedCustomers, setSortedCustomers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseApiUrl}customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filtering and sorting logic
    let filteredData = [...customers];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(
        (customer) =>
          customer.id.toString().includes(searchQuery) ||
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting logic
    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
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

    setSortedCustomers(filteredData);
  }, [customers, searchQuery, sortConfig]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Customers</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer ID, Name, or Email"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : sortedCustomers.length === 0 ? (
        <p>No customers to show</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  Customer ID
                  <select
                    onChange={(e) =>
                      handleSortChange("id", e.target.value)
                    }
                    className="form-control form-control-sm"
                  >
                    <option value="">Default</option>
                    <option value="asc">↑ Ascending</option>
                    <option value="desc">↓ Descending</option>
                  </select>
                </th>
                <th scope="col">
                  Name
                  <select
                    onChange={(e) =>
                      handleSortChange("name", e.target.value)
                    }
                    className="form-control form-control-sm"
                  >
                    <option value="">Default</option>
                    <option value="asc">↑ Ascending</option>
                    <option value="desc">↓ Descending</option>
                  </select>
                </th>
                <th scope="col">
                  Email
                  <select
                    onChange={(e) =>
                      handleSortChange("email", e.target.value)
                    }
                    className="form-control form-control-sm"
                  >
                    <option value="">Default</option>
                    <option value="asc">↑ Ascending</option>
                    <option value="desc">↓ Descending</option>
                  </select>
                </th>
                <th scope="col">Contact Number</th>
                <th scope="col">Number of Bookings</th>
                <th scope="col">Reference Numbers</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <th scope="row">{customer.id}</th>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.contact_number}</td>
                  <td>{customer.bookings.length}</td>
                  <td>
                    {customer.bookings.map((booking) => (
                      <div key={booking.refNumber}>
                        {booking.refNumber} ({booking.status})
                      </div>
                    ))}
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

export default AdminCustomers;
