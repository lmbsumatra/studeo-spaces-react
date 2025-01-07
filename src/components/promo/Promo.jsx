import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";

const promoData = [
  {
    title: "15-Day Pass",
    description:
      "Enjoy unlimited access for 15 days! Share with friends and use it anytime.",
    buttons: [
      { text: "Buy Now", action: "/buy-now" },
      { text: "Learn More", action: "/learn-more" },
    ],
  },
  {
    title: "Exclusive Membership",
    description:
      "Get exclusive benefits and rewards with our membership program.",
    buttons: [
      { text: "Join Now", action: "/join" },
      { text: "See Benefits", action: "/benefits" },
    ],
  },
  {
    title: "Special Offers",
    description: "Discover special offers tailored just for you!",
    buttons: [
      { text: "View Offers", action: "/offers" },
      { text: "Sign Up", action: "/sign-up" },
    ],
  },
];

const Promo = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const navigate = useNavigate(); // Use useNavigate

  return (
    <div className="container mb-5">
      <Slider {...settings}>
        {promoData.map((promo, index) => (
          <div key={index} className="card promo p-5">
            <h2 className="promo-title">{promo.title}</h2>
            <p className="promo-description">{promo.description}</p>
            {/* <div className="promo-buttons">
              {promo.buttons.map((button, btnIndex) => (
                <button
                  key={btnIndex}
                  className={`btn ${btnIndex === 0 ? "btn-primary-clr" : "btn-secondary-clr"}`}
                  onClick={() => navigate(button.action)} // Navigate to the action
                >
                  {button.text}
                </button>
              ))}
            </div> */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Promo;
