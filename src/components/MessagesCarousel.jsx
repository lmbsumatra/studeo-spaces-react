// src/components/MessageCarousel.js

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import mail from "../assets/images/icons/mail.svg";

const MessageCarousel = ({ messages }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrow: false
  };

  return (
    <Slider {...settings}>
      {messages.map((message, index) => (
        <div key={index} className="pb-3">
          <img
            src={mail}
            className="d-flex justify-content-center"
            style={{ height: "50px" }}
          />
          <h3>{message.message_type}</h3>
          <p>From: {message.name}</p>
          <p>{message.message}</p>
          <div className="d-flex w-100 justify-content-between">
            <button className="btn btn-warning text-white">Mark as read</button>
            <button className="btn btn-outline-danger bg-light text-danger">Delete</button>
            <button className="btn btn-primary text-white">View</button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MessageCarousel;
