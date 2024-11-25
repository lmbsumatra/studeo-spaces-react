import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/studeo-spaces-logo.png";
import { toast } from "react-toastify";
import { baseApiUrl } from "../../App";
import { Modal, Button, Spinner } from "react-bootstrap";
import hidePassword from "../../assets/images/icons/hidePassword.svg";
import viewPassword from "../../assets/images/icons/viewPassword.svg";
import "./adminLoginStyles.css";

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
  const [loading, setLoading] = useState(false); // Spinner state

  // Password visibility state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
    setLoading(true); // Show spinner

    // Validation for empty fields
    if (!username) {
      const errorMessage = "Username cannot be empty.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (!password) {
      const errorMessage = "Password cannot be empty.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }

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
      const errorMessage = error.response
        ? error.response.data.message
        : "Login failed. Please try again.";
      setError(errorMessage); // Display error below form
      toast.error(errorMessage); // Show toast notification
    } finally {
      setLoading(false); // Hide spinner regardless of success or failure
    }
  };

  // Handle "Forgot Password" modal toggle
  const handleForgotPasswordModalShow = () => setShowForgotPasswordModal(true);
  const resetForgotPasswordForm = () => {
    setForgotUsername("");
    setNewPassword("");
    setConfirmNewPassword("");
    setSecurityQuestion("");
    setSecurityAnswer("");
  };

  const handleForgotPasswordModalClose = () => {
    resetForgotPasswordForm();
    setShowForgotPasswordModal(false);
  };

  // Handle submit for forgot password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
    setLoading(true); // Show spinner

    // Validation for empty fields in forgot password form
    if (!forgotUsername) {
      const errorMessage = "Username cannot be empty.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (!newPassword) {
      const errorMessage = "New password cannot be empty.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (!confirmNewPassword) {
      const errorMessage = "Please confirm your new password.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (newPassword !== confirmNewPassword) {
      const errorMessage = "New password and confirm password do not match.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (!securityQuestion) {
      const errorMessage = "Please select a security question.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
      return;
    }
    if (!securityAnswer) {
      const errorMessage = "Security answer cannot be empty.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Hide spinner
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
      const errorMessage = error.response
        ? error.response.data.message
        : "Error resetting password. Please try again.";
      toast.error(errorMessage); // Show toast notification
      setError(errorMessage); // Display error below form
    } finally {
      setLoading(false); // Hide spinner regardless of success or failure
    }
  };

  // List of sample security questions
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your elementary school?",
  ];

  // Toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleNewPasswordVisibility = () =>
    setNewPasswordVisible(!newPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-6 col-lg-4 text-center">
        <h2>Admin Login</h2>
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} height="100px" alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <label
            htmlFor="newPassword"
            className="form-label d-flex justify-content-left"
          >
            Username
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <div className="position-relative mb-3">
            <label
              htmlFor="newPassword"
              className="form-label d-flex justify-content-left"
            >
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <img
              src={passwordVisible ? viewPassword : hidePassword}
              alt="toggle visibility"
              onClick={togglePasswordVisibility}
              className="show password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Login"
            )}
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
                disabled={loading}
              />
            </div>

            <div className="position-relative mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type={newPasswordVisible ? "text" : "password"}
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <img
                src={newPasswordVisible ? viewPassword : hidePassword}
                alt="toggle visibility"
                onClick={toggleNewPasswordVisibility}
                className="show password"
              />
            </div>

            <div className="position-relative mb-3">
              <label htmlFor="confirmNewPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmNewPassword"
                className="form-control"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <img
                src={confirmPasswordVisible ? viewPassword : hidePassword}
                alt="toggle visibility"
                onClick={toggleConfirmPasswordVisibility}
                className="show password"
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLoginScreen;
