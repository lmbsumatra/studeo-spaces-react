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
  const [currentStep, setCurrentStep] = useState(1); // Track current step in forgot password flow

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
const handleForgotPasswordModalShow = () => {
  setCurrentStep(1);  // Reset to step 1 when modal is shown
  setShowForgotPasswordModal(true);
};

  const resetForgotPasswordForm = () => {
    setForgotUsername("");
    setNewPassword("");
    setConfirmNewPassword("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setPasswordVisible(false);
    setConfirmPasswordVisible(false)
  };

  const handleForgotPasswordModalClose = () => {
    resetForgotPasswordForm();
    setShowForgotPasswordModal(false);
    setCurrentStep(1); // Reset to step 1
  };

  const handleUsernameCheckSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    try {
      const response = await axios.post(`${baseApiUrl}check-username`, {
        username: forgotUsername,
      });
  
      if (response.data.exists) {
        // Move to step 2 if username exists
        setCurrentStep(2);
      } else {
        toast.error("Username not found.");
      }
    } catch (error) {
      // Check if error is due to network failure
      if (!error.response) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        // Check for backend error status codes
        if (error.response.status === 400) {
          toast.error("Bad request: Invalid data.");
        } else if (error.response.status === 404) {
          toast.error("Admin not found.");
        } else if (error.response.status === 500) {
          toast.error("Server error: Please try again later.");
        } else {
          toast.error("Error checking username. Please try again.");
        }
      }
    } finally {
      setLoading(false); // Ensure loading is set to false after the API call finishes
    }
  };
  
  
  const handleSecurityCheckSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner
  
    try {
      const response = await axios.post(`${baseApiUrl}check-security`, {
        username: forgotUsername,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });
  
      if (response.data.valid) {
        setCurrentStep(3); // Move to step 3 if security answer is correct
      } else {
        toast.error("Incorrect security answer.");
      }
    } catch (error) {
      // Handle network errors
      if (!error.response) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        // Backend error status codes
        if (error.response.status === 400) {
          toast.error("Invalid security verification.");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized: Please check your credentials.");
        } else if (error.response.status === 500) {
          toast.error("Server error: Please try again later.");
        } else {
          toast.error("Error validating security question.");
        }
      }
    } finally {
      setLoading(false); // Hide spinner after the request completes
    }
  };
  
  
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Changing password for user:", forgotUsername);  // Log the username
  
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      console.warn("Passwords do not match:", forgotUsername);  // Log password mismatch
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${baseApiUrl}change-password`, {
        username: forgotUsername,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword
      });
  
      console.log("Password change response:", response.data);  // Log the response
      toast.success("Password changed successfully!");
      setShowForgotPasswordModal(false); // Close modal after success
      resetForgotPasswordForm();
    } catch (error) {
      if (!error.response) {
        toast.error("Network error: Please check your internet connection.");
        console.error("Network error while changing password:", error);  // Log network error
      } else {
        if (error.response.status === 400) {
          toast.error("Bad request: Invalid data.");
          console.error("400 Bad Request:", error.response.data);  // Log 400 error
        } else if (error.response.status === 401) {
          toast.error("Unauthorized: Please check your credentials.");
          console.warn("401 Unauthorized - Invalid credentials:", forgotUsername);  // Log 401 error
        } else if (error.response.status === 500) {
          toast.error("Server error: Please try again later.");
          console.error("500 Internal Server Error:", error.response.data);  // Log 500 error
        } else {
          toast.error("Error changing password.");
          console.error("Error changing password:", error.response.data);  // Log unknown error
        }
      }
    } finally {
      setLoading(false); // Ensure loading is set to false after the API call finishes
      console.log("Password change process completed for:", forgotUsername);  // Log completion
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
          {currentStep === 1 && (
            <form onSubmit={handleUsernameCheckSubmit}>
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
                  "Next"
                )}
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleSecurityCheckSubmit}>
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
                  "Next"
                )}
              </button>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handlePasswordChangeSubmit}>
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
                  "Change Password"
                )}
              </button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLoginScreen;
