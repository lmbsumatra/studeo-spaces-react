import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/studeo-spaces-logo.png";
import { toast } from "react-toastify";

const AdminLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admins", {
        username,
        password,
      });
      // Handle successful login
      console.log(response.data);
      localStorage.setItem("token", response.data.token); // Store token in localStorage
      navigate("/admin/dashboard"); // Redirect to dashboard
      toast.success(`Welcome, ${username}!`)
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response ? error.response.data.message : "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-6 col-lg-4 text-center">
        <h2>Admin Login</h2>
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} height="100px" />
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLoginScreen;
