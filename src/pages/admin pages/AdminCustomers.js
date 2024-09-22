import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../../App";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Customers</h1>
      {isLoading ? (
        <>
          <p>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </p>
        </>
      ) : customers.length === 0 ? (
        <p>No customers to show</p>
      ) : (
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
              {customers.map((customer) => (
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
