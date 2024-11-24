import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/studeo-spaces-logo.png";
import { toast } from "react-toastify";
import { baseApiUrl } from "../../App";
import { Modal, Button } from "react-bootstrap";

const AdminLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

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
      const response = await axios.post(`${baseApiUrl}admins`, {
        username,
        password,
      });

      // Store the JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the admin dashboard
      navigate("/admin/dashboard");

      toast.success(`Welcome, ${username}!`);
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response ? error.response.data.message : "Login failed");
    }
  };

  // Handle "Forgot Password" modal toggle
  const handleForgotPasswordModalShow = () => setShowForgotPasswordModal(true);
  const handleForgotPasswordModalClose = () =>
    setShowForgotPasswordModal(false);

  // Handle submit for forgot password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    console.log({
      username: forgotUsername,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword,
      security_question: securityQuestion,
      security_answer: securityAnswer,
    });

    // Ensure new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(`${baseApiUrl}reset-password`, {
        username: forgotUsername,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });

      toast.success(response.data.message || "Password reset successfully!");
      setShowForgotPasswordModal(false);
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error resetting password"
      );
    }
  };

  // List of sample security questions
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your elementary school?",
  ];

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-6 col-lg-4 text-center">
        <h2>Admin Login</h2>
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} height="100px" alt="Logo" />
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

        {/* Forgot Password Link */}
        <p className="mt-3">
          <button
            className="btn btn-link p-0"
            onClick={handleForgotPasswordModalShow}
          >
            Forgot Password?
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPasswordModal}
        onHide={handleForgotPasswordModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="forgotUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="forgotUsername"
                className="form-control"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmNewPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                className="form-control"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="securityQuestion" className="form-label">
                Select Security Question
              </label>
              <select
                id="securityQuestion"
                className="form-control"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
              >
                <option value="">Select a Question</option>
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="securityAnswer" className="form-label">
                Answer
              </label>
              <input
                type="text"
                id="securityAnswer"
                className="form-control"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLoginScreen;
