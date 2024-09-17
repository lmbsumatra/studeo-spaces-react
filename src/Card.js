import logo from "./assets/images/studeo-spaces-logo.jpg";
import "./card-style.css";
const Card = () => {
  return (
    <div>
      <div className="pass">
        <div className="header d-flex">
          <div>
            <img src={logo} height="40px" />
          </div>
          <div>Studeo Spaces</div>
        </div>

        <div className="body">
          <div className="center d-flex">
            <div className="bullets-1">
              <div className="bullet">1</div>
              <div className="bullet">2</div>
              <div className="bullet">3</div>
              <div className="bullet">4</div>
              <div className="bullet">5</div>
            </div>
            <div className="user-id">
              <div className="id-picture"></div>
              <div className="name title">Name</div>
              <div className="name sub-title">Name</div>
              <div className="id title">ID No.</div>
              <div className="id sub-title">ID No.</div>
              <div className="address title">Address</div>
              <div className="address sub-title">Address</div>
              <div className="contactNo title">Contact No.</div>
              <div className="contactNo sub-title">Contact No.</div>
            </div>
            <div className="bullets-1">
              <div className="bullet">11</div>
              <div className="bullet">12</div>
              <div className="bullet">13</div>
              <div className="bullet">14</div>
              <div className="bullet">15</div>
            </div>
          </div>
          <div className="bottom bullets-2 d-flex justify-content-between">
            <div className="bullet">6</div>
            <div className="bullet">7</div>
            <div className="bullet">8</div>
            <div className="bullet">9</div>
            <div className="bullet">10</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
