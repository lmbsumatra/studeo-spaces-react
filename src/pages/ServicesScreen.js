import React from "react";
import Footer from "../components/Footer";
import Service from "../components/services/Service";

const Services = () => {
  return (
    <div className="container mt-5">
      <Service title='Services' isBookingPage={false}/>
      <Footer />
    </div>
  );
};

export default Services;
