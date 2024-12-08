import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import attention from "../assets/images/icons/attention.svg";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const MessageCarousel = ({ messages }) => {
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleViewClick = (id) => {
    // Navigate to the message details page
    navigate(`/admin/messages?highlight=${id}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false
  };

  return (
    <Slider {...settings} style={{ padding: "0px", height: "auto" }}>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <img src={attention} style={{ height: "50px" }} alt="mail icon" />
          <h3>{message.message_type}</h3>
          <p>From: {message.name}</p>
          <p>{message.message}</p>
          <div className="d-flex w-100 justify-content-between">
            <button
              className="btn btn-primary text-white"
              onClick={() => handleViewClick(message.id)}  // Navigate on click
            >
              View
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MessageCarousel;
