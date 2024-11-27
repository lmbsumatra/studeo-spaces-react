import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { baseApiUrl } from "../../App";
import { jwtDecode } from "jwt-decode";
import hidePassword from "../../assets/images/icons/hidePassword.svg";
import viewPassword from "../../assets/images/icons/viewPassword.svg";
import { toast } from "react-toastify"; // Importing toast

const AdminSettings = () => {
  // States for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [selectedSecurityQuestion, setSelectedSecurityQuestion] = useState("");
  const [selectedSecurityAnswer, setSelectedSecurityAnswer] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // States for managing modals visibility
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] =
    useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Password visibility toggle states
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const token = localStorage.getItem("token");

  // Handle modal visibility toggles
  const handleUsernameModalShow = () => setShowUsernameModal(true);
  const handleUsernameModalClose = () => {
    setUsername(""); // Reset input field
    setSecurityAnswer(""); // Reset security answer
    setSelectedSecurityQuestion(""); // Reset security question
    setError(null); // Clear error message
    setShowUsernameModal(false);
  };

  const handlePasswordModalShow = () => setShowPasswordModal(true);
  const handlePasswordModalClose = () => {
    setPassword(""); // Reset password field
    setNewPassword(""); // Reset new password field
    setConfirmNewPassword(""); // Reset confirm new password field
    setSecurityAnswer(""); // Reset security answer
    setSelectedSecurityQuestion(""); // Reset security question
    setError(null); // Clear error message
    setIsPasswordVisible(false);
    setShowPasswordModal(false);
    setIsNewPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  const handleSecurityQuestionModalShow = () =>
    setShowSecurityQuestionModal(true);
  const handleSecurityQuestionModalClose = () => {
    setSelectedSecurityQuestion(""); // Reset security question
    setSecurityAnswer(""); // Reset security answer
    setAdminPassword(""); // Reset admin password
    setError(null); // Clear error message
    setShowSecurityQuestionModal(false);
    setIsPasswordVisible(false);
  };

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.admin_id;

    try {
      const response = await axios.post(
        `${baseApiUrl}update-username`,
        {
          username,
          securityQuestion: selectedSecurityQuestion,
          securityAnswer: securityAnswer,
          adminId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Username updated successfully") {
        toast.success("Username updated successfully!"); // Show success toast
        handleUsernameModalClose();
      } else {
        setError("Error updating username");
        toast.error(
          "Error updating username: " + response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      let errorMessage = "Error updating username";
      if (error.response) {
        // Handle backend errors more gracefully
        const { status, data } = error.response;
        if (data && data.message) {
          errorMessage = data.message; // Show backend error message if available
        }
        if (status === 400) {
          // If it's a validation error, show specific details
          errorMessage = data?.errors ? data.errors.join(", ") : errorMessage;
        }
        toast.error(`Error: ${errorMessage}`); // Show backend error message in toast
      } else if (error.request) {
        // If no response was received
        errorMessage = "No response from the server";
        toast.error(errorMessage); // Show connection error
      } else {
        // If something else went wrong
        errorMessage = error.message || "An unexpected error occurred";
        toast.error(errorMessage); // Show unexpected error message
      }
      setError(errorMessage); // Update form error state
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match!");
      toast.error("New password and confirm password do not match!"); // Show error toast
      return;
    }

    setIsLoading(true); // Start loading
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.admin_id;

    try {
      const response = await axios.post(
        `${baseApiUrl}update-password`,
        {
          admin_id: decodedToken.admin_id,
          current_password: password,
          new_password: newPassword,
          new_password_confirmation: confirmNewPassword,
          security_answer: securityAnswer,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Password updated successfully") {
        toast.success("Password updated successfully!"); // Show success toast
        handlePasswordModalClose();
      } else {
        setError(response.data.message || "Error updating password");
        toast.error(
          "Error updating password: " + response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      let errorMessage = "Error updating password";
      if (error.response) {
        // Handle backend errors more gracefully
        const { status, data } = error.response;
        if (data && data.message) {
          errorMessage = data.message; // Show backend error message if available
        }
        if (status === 400) {
          // If it's a validation error, show specific details
          errorMessage = data?.errors ? data.errors.join(", ") : errorMessage;
        }
        toast.error(`Error: ${errorMessage}`); // Show backend error message in toast
      } else if (error.request) {
        // If no response was received
        errorMessage = "No response from the server";
        toast.error(errorMessage); // Show connection error
      } else {
        // If something else went wrong
        errorMessage = error.message || "An unexpected error occurred";
        toast.error(errorMessage); // Show unexpected error message
      }
      setError(errorMessage); // Update form error state
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleSubmitSecurityQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.admin_id;

    try {
      const response = await axios.post(
        `${baseApiUrl}update-security-question`,
        {
          new_security_question: selectedSecurityQuestion,
          new_security_answer: securityAnswer,
          admin_password: adminPassword,
          admin_id: adminId,
        }
      );

      toast.success("Security question updated successfully!"); // Show success toast
      handleSecurityQuestionModalClose();
    } catch (error) {
      let errorMessage = "Error updating security question";
      if (error.response) {
        // Handle backend errors more gracefully
        const { status, data } = error.response;
        if (data && data.message) {
          errorMessage = data.message; // Show backend error message if available
        }
        if (status === 400) {
          // If it's a validation error, show specific details
          errorMessage = data?.errors ? data.errors.join(", ") : errorMessage;
        }
        toast.error(`Error: ${errorMessage}`); // Show backend error message in toast
      } else if (error.request) {
        // If no response was received
        errorMessage = "No response from the server";
        toast.error(errorMessage); // Show connection error
      } else {
        // If something else went wrong
        errorMessage = error.message || "An unexpected error occurred";
        toast.error(errorMessage); // Show unexpected error message
      }
      setError(errorMessage); // Update form error state
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // List of sample security questions
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your elementary school?",
  ];

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="container mt-5">
      <h1 className="fs-700 ff-serif text-center">Update Admin Credentials</h1>

      <div className="mb-3">
        <Button variant="primary" onClick={handleUsernameModalShow}>
          Change Username
        </Button>
      </div>
      <div className="mb-3">
        <Button variant="primary" onClick={handlePasswordModalShow}>
          Change Password
        </Button>
      </div>
      <div className="mb-3">
        <Button variant="primary" onClick={handleSecurityQuestionModalShow}>
          Update Security Question
        </Button>
      </div>

      {/* Change Username Modal */}
      <Modal show={showUsernameModal} onHide={handleUsernameModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmitUsername}>
            <div className="mb-3">
              <label htmlFor="newUsername" className="form-label">
                New Username
              </label>
              <input
                type="text"
                id="newUsername"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="securityQuestion" className="form-label">
                Select Security Question
              </label>
              <select
                id="securityQuestion"
                className="form-control"
                value={selectedSecurityQuestion}
                onChange={(e) => setSelectedSecurityQuestion(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={handlePasswordModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmitPassword}>
            <div className="mb-3 position-relative">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="currentPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <img
                src={isPasswordVisible ? viewPassword : hidePassword}
                alt="Toggle password visibility"
                className="show password"
                onClick={togglePasswordVisibility}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <img
                src={isNewPasswordVisible ? viewPassword : hidePassword}
                alt="Toggle new password visibility"
                className="show password"
                onClick={toggleNewPasswordVisibility}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="confirmNewPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="confirmNewPassword"
                className="form-control"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <img
                className="show password"
                onClick={toggleConfirmPasswordVisibility}
                src={isConfirmPasswordVisible ? viewPassword : hidePassword}
                alt="Toggle confirm password visibility"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="securityQuestion" className="form-label">
                Select Security Question
              </label>
              <select
                id="securityQuestion"
                className="form-control"
                value={selectedSecurityQuestion}
                onChange={(e) => setSelectedSecurityQuestion(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Update Security Question Modal */}
      <Modal
        show={showSecurityQuestionModal}
        onHide={handleSecurityQuestionModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Security Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmitSecurityQuestion}>
            <div className="mb-3">
              <label htmlFor="securityQuestion" className="form-label">
                New Security Question
              </label>
              <select
                id="securityQuestion"
                className="form-control"
                value={selectedSecurityQuestion}
                onChange={(e) => setSelectedSecurityQuestion(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="adminPassword" className="form-label">
                Admin Password
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="adminPassword"
                className="form-control"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <img
                src={isPasswordVisible ? viewPassword : hidePassword}
                alt="Toggle password visibility"
                className="show password"
                onClick={togglePasswordVisibility}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminSettings;
