import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseApiUrl } from '../../App';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [sortedPayments, setSortedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}payments`);
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payments');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filteredPayments = [...payments];

    if (searchQuery) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (sortConfig.key && sortConfig.direction) {
      filteredPayments.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setSortedPayments(filteredPayments);
  }, [payments, sortConfig, searchQuery, statusFilter]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Payments</h1>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control"
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">
                Payment ID
                <select
                  onChange={(e) => handleSortChange('id', e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="">Sort</option>
                  <option value="asc">↑ Ascending</option>
                  <option value="desc">↓ Descending</option>
                </select>
              </th>
              <th scope="col">
                Customer Name
                <select
                  onChange={(e) => handleSortChange('customer_name', e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="">Sort</option>
                  <option value="asc">↑ Ascending</option>
                  <option value="desc">↓ Descending</option>
                </select>
              </th>
              <th scope="col">
                Amount
                <select
                  onChange={(e) => handleSortChange('amount', e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="">Sort</option>
                  <option value="asc">↑ Ascending</option>
                  <option value="desc">↓ Descending</option>
                </select>
              </th>
              <th scope="col">
                Date
                <select
                  onChange={(e) => handleSortChange('date', e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="">Sort</option>
                  <option value="asc">↑ Ascending</option>
                  <option value="desc">↓ Descending</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map(payment => (
              <tr key={payment.id}>
                <th scope="row">{payment.id}</th>
                <td>{payment.customer_name}</td>
                <td>₱{payment.amount}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;