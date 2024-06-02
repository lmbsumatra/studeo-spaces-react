import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Authentication logic here
    // For example:
    if (username === 'admin' && password === 'password') {
      // Redirect to admin dashboard upon successful login
      navigate('/admin/dashboard');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-5">Admin Login</h2>
      <form onSubmit={handleLogin} className="mt-3">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-clr w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLoginScreen;
