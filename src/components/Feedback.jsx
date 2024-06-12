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
              className="icon-img"s
              alt="..."
            />
          </div>
          <div className="card-body">
            <p className="card-text fs-300 fst-italic">
              "I stayed here almost everyday from August to October 2023 for my board review season. I passed po the recent Physician Licensure Examinations and I could say na malaki yung natulong ng Studeo sakin.."
            </p>
            <br />
            <h5 className="card-title ff-serif">Marie Mandario</h5>
            <h6 className="card-title ff-serif">Physician - Physician Licensure Examination Board Passer 2023</h6>
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
              "Hello po! OTRP na po ako!! Maraming salamat po, Studeo Spaces! Lalo na rin po kay Ate Sol dahil matiyaga po niya akong hinihintay madalas kahit 5 AM na matatapos and napakabait na nireremind kami palagi na matulog kahit saglit sa napping area 🥺."
            </p>
            <br />
            <h5 className="card-title ff-serif">Raeverly Kris Chan</h5>
            <h6 className="card-title ff-serif">Occupational Therapist Registered Philippines - PRC Board Passer 2023 </h6>
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
              "Hi Studeo Spaces Study Hub, Engineer na po kami!! We're so blessed and thankful to have known this place during our review. Kaya sa mga friends ko jan around Dapitan...."
            </p>
            <br />
            <h5 className="card-title ff-serif">Shaina Joyce Catapang</h5>
            <h6 className="card-title ff-serif">Engineer - Licensure Exam Passer 2023 </h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
