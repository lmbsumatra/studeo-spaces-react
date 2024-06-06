import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Feedback = () => {
  return (
    <section className="container items" id="feedback">
      <h1 className="fs-700 ff-serif text-center">Feedbacks</h1>
      <div className="d-flex justify-content-around">
        <div className="card flex-items"  style={{ width: '18rem' }}>
          <div className="icon">
            <img
              src="./assets/images/img_1.jpg"
              className="icon-img"
              alt="..."
            />
          </div>
          <div className="card-body">
            <p className="card-text fs-300 fst-italic">
              "Some quick example text to build on the card title and make up
              the bulk of the card's content."
            </p>
            <br />
            <h5 className="card-title ff-serif">Firstname Lastname</h5>
            <h6 className="card-title ff-serif">Status - Title</h6>
          </div>
        </div>
        <div className="card flex-items" style={{ width: '18rem' }}>
          <div className="icon">
            <img
              src="./assets/images/img_1.jpg"
              className="icon-img"
              alt="..."
            />
          </div>
          <div className="card-body">
            <p className="card-text fs-300 fst-italic">
              "Some quick example text to build on the card title and make up
              the bulk of the card's content."
            </p>
            <br />
            <h5 className="card-title ff-serif">Firstname Lastname</h5>
            <h6 className="card-title ff-serif">Status - Title</h6>
          </div>
        </div>
        <div className="card flex-items" style={{ width: '18rem' }}>
          <div className="icon">
            <img
              src="./assets/images/img_1.jpg"
              className="icon-img"
              alt="..."
            />
          </div>
          <div className="card-body">
            <p className="card-text fs-300 fst-italic">
              "Some quick example text to build on the card title and make up
              the bulk of the card's content."
            </p>
            <br />
            <h5 className="card-title ff-serif">Firstname Lastname</h5>
            <h6 className="card-title ff-serif">Status - Title</h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
