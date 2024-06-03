import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Service = () => {
  return (
    <section className="container items">
      <h1 className="fs-700 ff-serif text-center">Top Services</h1>
      <div className="d-flex justify-content-around">
        <div className="card" style={{ width: '18rem' }}>
          <img
            src="./assets/images/img_1.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="btn btn-primary-clr">Go somewhere</a>
          </div>
        </div>

        <div className="card" style={{ width: '18rem' }}>
          <img
            src="./assets/images/img_1.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="btn btn-primary-clr">Go somewhere</a>
          </div>
        </div>

        <div className="card" style={{ width: '18rem' }}>
          <img
            src="./assets/images/img_1.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="btn btn-primary-clr">Go somewhere</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;