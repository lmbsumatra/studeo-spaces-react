import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import feedbackImg from "../assets/images/icons/feedback.svg"
import { Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { baseApiUrl } from "../App";

const FeedbackCarousel = ({  }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };
  const [loadingFeedbackId, setLoadingFeedbackId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseApiUrl}feedbacks`);
      if (!response.ok) throw new Error("Failed to fetch feedbacks");
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <Slider {...settings} style={{ padding: "0px", height: "auto" }}>
      {feedbacks.map((feedback, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={feedbackImg} style={{ height: "50px" }} alt="mail icon" />
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
                Status: {feedback.publish === 0 ? "Not published" : "Published"}
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
    </Slider>
  );
};

export default FeedbackCarousel;
