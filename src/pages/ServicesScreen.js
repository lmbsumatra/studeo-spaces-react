import React from "react";
import Footer from "../components/Footer";
import Service from "../components/services/Service";

const Services = () => {
  return (
    <div>
      <Service title='Services' isBookingPage={false}/>
      <Footer />
    </div>
  );
};

export default Services;
