import React from "react";

const Footer = () => {
  return (
    <footer className="container mt-5">
      <hr/>
      <div className="row items">
        <div className="col flex-items">
          <ul>
            <li style={{ width: "50px", height: "50px" }}>
              <a href="#">
                <img
                  src="../../assets/images/studeo-spaces-logo.png"
                  alt="Studeo Spaces Logo"
                />
              </a>
            </li>
            <li>
              <a href="#">Studeo Spaces</a>
            </li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <p className="fw-bold">Connect</p>
            <li>2nd Floor, Studeo Suites 1707 Dapitan corner Dela Fuente Streets, Sampaloc, 1008</li>
            <li>(02) 7002 5702</li>
            <li><a href="https://www.facebook.com/StudeoSpaces">Facebook Page</a></li>
            <li>info@studeospaces.com</li>
          </ul>
        </div>
        <div className="col">
          <ul>
            <p className="fw-bold">Legal</p>
            <li>
              <a href="/policies">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms-and-conditions">Terms and Condition</a>
            </li>
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
