import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./adminFeedbackStyles.css";
import { Spinner } from "react-bootstrap";
import { baseApiUrl } from "../../../App";
import user from "../../../assets/images/icons/user.svg";

const AdminFeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFeedbackId, setLoadingFeedbackId] = useState(null); // Track which feedback is loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseApiUrl}feedbacks`);
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const togglePublish = async (feedbackId, currentStatus) => {
    // Optimistically update the feedback status
    const updatedStatus = currentStatus ? 0 : 1; // Toggle the status
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === feedbackId
          ? { ...feedback, publish: updatedStatus }
          : feedback
      )
    );

    setLoadingFeedbackId(feedbackId); // Set the loading state for the specific feedback

    try {
      const response = await fetch(`${baseApiUrl}feedbacks/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publish: updatedStatus }), // Send the updated status
      });
      if (!response.ok) throw new Error("Failed to update feedback status");
    } catch (error) {
      setError(error.message);

      // If there is an error, revert the status back to the original state
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === feedbackId
            ? { ...feedback, publish: currentStatus } // Revert to original status
            : feedback
        )
      );
    } finally {
      setLoadingFeedbackId(null); // Reset loading state after operation
    }
  };

  return (
    <section className="container items mt-5" id="admin-services">
      <h1 className="fs-700 ff-serif text-center">Customer Feedbacks</h1>
      <div className="mt-4"></div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="row">
          {feedbacks.map((feedback) => (
            <div
              className="card d-flex flex-column justify-content-between align-items-center text-center"
              style={{ width: "19rem", marginLeft: "10px" }}
              key={feedback.id}
            >
              <div
                className="icon d-flex justify-content-center align-items-center"
                style={{ height: "100px" }}
              >
                <img src={user} className="icon-img" alt="User Icon" />
              </div>
              <div className="card-body d-flex flex-column align-items-center">
                <p className="card-text fs-300 fst-italic">
                  "{feedback.message.message}"
                </p>
                <h5 className="card-title ff-serif">
                  {feedback.message.name || "Anonymous"}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {feedback.message.email}
                </h6>
                <div className="d-flex">
                  <h6
                    className={`${
                      feedback.publish === 0 ? "text-danger" : "text-success"
                    } card-subtitle m-2`}
                  >
                    Status:{" "}
                    {feedback.publish === 0 ? "Not published" : "Published"}
                  </h6>
                  <button
                    className={`btn ${
                      feedback.publish ? "btn-warning" : "btn-success"
                    }`}
                    onClick={() => togglePublish(feedback.id, feedback.publish)}
                    disabled={loadingFeedbackId === feedback.id} // Disable button if loading
                  >
                    {loadingFeedbackId === feedback.id ? (
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : feedback.publish ? (
                      "Unpublish"
                    ) : (
                      "Publish"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminFeedbackScreen;
