import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hero = () => {
  return (
    <section className="hero container">
      <div className="row">
        <div className="col">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
            distinctio.
          </p>
          <h1 className="fs-800 ff-serif">Studeo</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
            distinctio. Lorem ipsum dolor, sit amet consectetur adipisicing
            elit. Fugiat, distinctio. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Fugiat, distinctio.
          </p>
          <button className="btn btn-primary-clr">Learn More</button>
        </div>
        <div className="col">
          <img
            src="./assets/images/img_1.jpg"
            alt=""
            width="200"
            height="200"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
