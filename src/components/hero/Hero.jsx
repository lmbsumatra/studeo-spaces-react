import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css"

const Hero = () => {
  return (
    <section className="hero container-fluid">
        <div className="">
          <p>Your Ultimate Study Hub</p>
          <h1 className="fs-800 ff-serif">
            Studeo <em>Spaces</em>
          </h1>
          <p className="text-container">
            Discover the perfect environment for focused learning and academic
            excellence. Whether you are a college student or preparing for board
            exams, Studeo Spaces offers a supportive and resourceful atmosphere
            tailored to your study needs.
          </p>
          <button className="btn btn-primary-clr learn-more-button">Learn More</button>
        </div>
    </section>
  );
};

export default Hero;
