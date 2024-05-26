import React from 'react';
import Hero from '../components/Hero';
import Service from '../components/Service';
import Blogs from '../components/Blogs';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

const HomeScreen = ({ match }) => {
  window.scrollTo(0, 0);
  return (
    <div>
      <Hero />
      <Service />
      <Blogs />
      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
