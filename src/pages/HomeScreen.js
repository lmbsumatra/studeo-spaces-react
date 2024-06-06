import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Hero from '../components/hero/Hero';
import Service from '../components/services/Service.jsx';
import Blogs from '../components/Blogs';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

const HomeScreen = ({ match }) => {
  return (
    <div>
      <Hero />
      <Service title='Top Services' show={3} isBookingPage={false}/>
      <Blogs />
      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
