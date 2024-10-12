import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import user from "../../assets/images/icons/user.svg";
import { baseApiUrl } from "../../App";
import Spinner from 'react-bootstrap/Spinner'; // Make sure to install react-bootstrap if not already
import Slider from 'react-slick'; // Import Slider from react-slick
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick theme CSS

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${baseApiUrl}feedbacks`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Filter feedbacks where publish = 0
        const publishedFeedbacks = data.filter(
          (feedback) => feedback.publish === 1
        );
        setFeedbacks(publishedFeedbacks);
      } catch (err) {
        console.error("There was an error fetching feedbacks!", err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFeedbacks();
  }, []);

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 slides at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
  };

  return (
    <section className="container items" id="feedback">
      <h1 className="fs-700 ff-serif text-center">Feedbacks</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : feedbacks.length > 0 ? (
        <Slider {...settings}>
          {feedbacks.map((feedback) => (
            <div
              className="card d-flex flex-column justify-content-between align-items-center text-center"
              style={{ width: "11rem", margin: "0 100px" }} // Add margin here
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
                  "{feedback.message.message}"{" "}
                  {/* Displaying the feedback message */}
                </p>
                <h5 className="card-title ff-serif mt-3">
                  {feedback.message.name || "Anonymous"}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Title
                </h6>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center">No feedback available.</p>
      )}
    </section>
  );
};

export default Feedback;
