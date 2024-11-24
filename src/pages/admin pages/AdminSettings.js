import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // For modal functionality
import axios from "axios"; // Make sure you have axios installed
import { baseApiUrl } from "../../App";
import { jwtDecode } from "jwt-decode";

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

  const token = localStorage.getItem("token");

  // Handle modal visibility toggles
  const handleUsernameModalShow = () => setShowUsernameModal(true);
  const handleUsernameModalClose = () => setShowUsernameModal(false);

  const handlePasswordModalShow = () => setShowPasswordModal(true);
  const handlePasswordModalClose = () => setShowPasswordModal(false);

  const handleSecurityQuestionModalShow = () =>
    setShowSecurityQuestionModal(true);
  const handleSecurityQuestionModalClose = () =>
    setShowSecurityQuestionModal(false);

  const handleSubmitUsername = async (e) => {
    e.preventDefault(); // Call preventDefault early to prevent the form submission before we start processing.

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.admin_id; // Get admin_id from the decoded token

    console.log(
      username,
      selectedSecurityQuestion,
      securityAnswer,
      decodedToken,
      adminId
    );

    try {
      // Send the request with adminId instead of admin_id (matching the backend)
      const response = await axios.post(
        `${baseApiUrl}update-username`,
        {
          username,
          securityQuestion: selectedSecurityQuestion,
          securityAnswer: securityAnswer,
          adminId, // ensure this is correctly passed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      // Handle success response
      if (response.data.message === "Username updated successfully") {
        alert("Username updated!");
        handleUsernameModalClose();
      } else {
        alert("Error updating username");
      }
    } catch (error) {
      alert("Error updating username");
      console.error(error);
    }
  };

  // Handle form submission for changing password
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      // Get the adminId from the decoded JWT token
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.admin_id;

      console.log({
        admin_id: decodedToken.admin_id, // Pass admin_id here
        current_password: password, // Current password
        new_password: newPassword, // New password
        new_password_confirmation: confirmNewPassword,
        security_answer: securityAnswer, // Security answer
      });

      // Make the API request to change the password
      const response = await axios.post(
        `${baseApiUrl}update-password`,
        {
          admin_id: decodedToken.admin_id, // Pass admin_id here
          current_password: password, // Current password
          new_password: newPassword, // New password
          new_password_confirmation: confirmNewPassword,
          security_answer: securityAnswer, // Security answer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      // Handle successful response
      if (response.data.message === "Password updated successfully") {
        alert("Password updated!");
        handlePasswordModalClose();
      } else {
        alert(response.data.message || "Error updating password");
      }
    } catch (error) {
      // Handle errors and show an alert with the error message
      alert("Error updating password");
      console.error(error.response ? error.response.data : error);
    }
  };

  // Handle form submission for updating security question
  const handleSubmitSecurityQuestion = async (e) => {
    // Get the adminId from the decoded JWT token
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.admin_id;
    e.preventDefault();
    try {
      await axios.post(`${baseApiUrl}update-security-question`, {
        new_security_question: selectedSecurityQuestion,
        new_security_answer: securityAnswer,
        admin_password: adminPassword,
        admin_id: adminId,
      });

      alert("Security question updated!");
      handleSecurityQuestionModalClose();
    } catch (error) {
      alert("Error updating security question");
      console.error(error);
    }
  };

  // List of sample security questions
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your elementary school?",
  ];

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
              Save Changes
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
          <form onSubmit={handleSubmitPassword}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={selectedSecurityQuestion}
                onChange={(e) => setSelectedSecurityQuestion(e.target.value)}
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
              Save Changes
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
          <form onSubmit={handleSubmitSecurityQuestion}>
            <div className="mb-3">
              <label htmlFor="securityQuestion" className="form-label">
                Select New Security Question
              </label>
              <select
                id="securityQuestion"
                className="form-control"
                value={selectedSecurityQuestion}
                onChange={(e) => setSelectedSecurityQuestion(e.target.value)}
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
                New Answer
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

            <div className="mb-3">
              <label htmlFor="adminPassword" className="form-label">
                Admin Password
              </label>
              <input
                type="password"
                id="adminPassword"
                className="form-control"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminSettings;
