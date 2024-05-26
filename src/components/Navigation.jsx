import React, { useEffect } from "react";
import logo from "../assets/images/studeo-spaces-logo.png";

import Button from "react-bootstrap/Button";

const Navigation = () => {
  useEffect(() => {
    const nav = document.querySelector(".primary-navigation");
    const navToggle = document.querySelector(".mobile-nav-toggle");

    const toggleNav = () => {
      const visibility = nav.getAttribute("data-visible") === "true";
      nav.setAttribute("data-visible", !visibility);
      navToggle.setAttribute("aria-expanded", !visibility);
    };

    navToggle.addEventListener("click", toggleNav);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      navToggle.removeEventListener("click", toggleNav);
    };
  }, []);

  return (
    <div>
      <header className="primary-header flex">
        <div>
          <img src={logo} alt="Studeo Spaces Logo" class="logo" />
        </div>

        <button
          className="mobile-nav-toggle"
          menu-toggled="false"
          aria-controls="primary-navigation"
        >
          <span className="sr-only" aria-expanded="true">
            Menu
          </span>
        </button>
        <nav className="flex">
          <ul
            id="primary-navigation"
            className="primary-navigation underline-indicators flex"
            style={{ "--gap": "" }}
            data-visible="false"
          >
            <li className="active">
              <a
                href="/"
                className="ff-sans-cond uppercase text-white letter-spacing-2"
              >
                <span aria-hidden="true">00</span>Home
              </a>
            </li>
            <li>
              <a
                href="/blogs"
                className="ff-sans-cond uppercase text-white letter-spacing-2"
              >
                <span aria-hidden="true">01</span>Blogs
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="ff-sans-cond uppercase text-white letter-spacing-2"
              >
                <span aria-hidden="true">02</span>Services
              </a>
            </li>
            <li>
              <a href="/faqs" className="uppercase text-white letter-spacing-2">
                <span aria-hidden="true">03</span>FAQs
              </a>
            </li>
            <li>
              <a href="/book" className="uppercase text-white letter-spacing-2">
                <span aria-hidden="true">04</span><Button variant="primary">Book</Button>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navigation;
