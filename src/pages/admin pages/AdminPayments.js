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
  
  // Fetch payments on component mount
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
  }, []); // Empty dependency array ensures this runs once on mount

  // Apply sorting and filtering
  useEffect(() => {
    let filteredPayments = [...payments];

    // Apply search filter by Customer Name
    if (searchQuery) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sorting logic
    if (sortConfig.key) {
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

  // Handle sorting changes
  const handleSortChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ); // Show loading spinner while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show error message if fetch fails
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Payments</h1>

      {/* Search and Filters */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control"
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">
                Payment ID
                <button onClick={() => handleSortChange('id')} className="btn btn-link btn-sm">
                  {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
                </button>
              </th>
              <th scope="col">
                Customer Name
                <button onClick={() => handleSortChange('customer_name')} className="btn btn-link btn-sm">
                  {sortConfig.key === 'customer_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
                </button>
              </th>
              <th scope="col">
                Amount
                <button onClick={() => handleSortChange('amount')} className="btn btn-link btn-sm">
                  {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
                </button>
              </th>
              <th scope="col">
                Date
                <button onClick={() => handleSortChange('date')} className="btn btn-link btn-sm">
                  {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↓'}
                </button>
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
