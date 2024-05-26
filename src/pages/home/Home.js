import React, { useEffect } from "react";
import "./style.css";
import Navigation from "../../components/Navigation";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../../assets/images/blogs/img_1.jpg";

const Home = () => {
  useEffect(() => {
    document.title = "Home";
  });

  return (
    <div className="home">
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
        <span class="d-block fs-700 ff-serif uppercase text-white">
          Services
        </span>
        <div className="tile-container">
          <div>
            <Card>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <div className="container center">
        <span class="d-block fs-700 ff-serif uppercase text-white">Blogs</span>
        <div className="grid-container grid-container--blog">
          <div>
            <p>
              Let’s face it; if you want to go to space, you might as well
              genuinely go to outer space and not hover kind of on the edge of
              it. Well sit back, and relax because we’ll give you a truly out of
              this world experience!
            </p>
            <Button>Read more</Button>
          </div>
          <div>
            <img src={img1} />
          </div>
        </div>
        <div className="grid-container grid-container--blog">
          <div>
            <img src={img1} />
          </div>
          <div>
            <p>
              Let’s face it; if you want to go to space, you might as well
              genuinely go to outer space and not hover kind of on the edge of
              it. Well sit back, and relax because we’ll give you a truly out of
              this world experience!
            </p>
            <Button>Read more</Button>
          </div>
        </div>
      </div>

      <div className="container center">
        <span class="d-block fs-700 ff-serif uppercase text-white">
          Feedbacks
        </span>

        <Carousel
          style={{
            height: "auto",
            display: "flex",
            border: "1px red solid",
            justifyContent: "center",
          }}
        >
          <Carousel.Item
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              margin: "20px 0",
            }}
          >
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                border: "1px solid violet",
                margin: "30px",
                padding: "10px",
              }}
            >
              <Card.Img
                variant="top"
                src="holder.js/100px180"
                style={{
                  borderRadius: "50%",
                  border: "1px solid black",
                  width: "50px",
                  height: "50px",
                }}
              />
              <Card.Body>
                <Card.Text className="fs-200">
                  "Some quick example text to build on the card title and make
                  up the bulk of the card's content. Some quick example text to
                  build on the card title and make up the bulk of the card's
                  content."
                </Card.Text>
                <Card.Title className="fs-300">Person Name</Card.Title>
                <Card.Title className="fs-300">Status / Title</Card.Title>
              </Card.Body>
            </Card>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
