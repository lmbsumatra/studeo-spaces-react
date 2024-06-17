import React from 'react';

const Footer = () => {
  return (
    <footer className="container mt-5">
      <div className="row items">
        <div className="col flex-items">
          <ul>
            <li style={{ width: '50px', height: '50px' }}>
              <a href="#"><img src="../../assets/images/studeo-spaces-logo.png"alt="Studeo Spaces Logo" /></a>
            </li>
            <li><a href="#">Studeo Spaces</a></li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <p>About</p>
            <li><a href="#">Our story</a></li>
            <li><a href="#">Mission</a></li>
            <li><a href="#">Benefits</a></li>
            <li><a href="#">Team</a></li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <p>Connect</p>
            <li>Address</li>
            <li>Phone Number</li>
            <li>Telephone Number</li>
            <li>Visit our Facebook Page</li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <p>Legal</p>
            <li><a href="#">Terms and Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Don't sell my information</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="text-center">
        <p>© 2024 Studeo Spaces. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
