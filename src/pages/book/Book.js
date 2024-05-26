import React, { useEffect } from "react";
// import "./style.css";
import Navigation from "../../components/Navigation";

import Button from "react-bootstrap/Button";

import img1 from "../../assets/images/blogs/img_1.jpg";

const Book = () => {
  useEffect(() => {
    document.title = "Book";
  });

  return (
    <div>
      <Navigation />

      <main class="grid-container grid-container--home">
        <div>
          <h1 class="text-accent fs-500 ff-sans-cond uppercase letter-spacing-1">
            So, you want to travel to
            <span class="d-block fs-900 ff-serif text-white">Space</span>
          </h1>

          <p>
            Let’s face it; if you want to go to space, you might as well
            genuinely go to outer space and not hover kind of on the edge of it.
            Well sit back, and relax because we’ll give you a truly out of this
            world experience!
          </p>
        </div>

        <div>
          <a
            href="#"
            class="large-button uppercase ff-serif text-dark bg-white"
          >
            Explore
          </a>
        </div>
      </main>

      <div className="container center">
        <span class="d-block fs-700 ff-serif uppercase text-white">Book</span>
      </div>
    </div>
  );
};

export default Book;
