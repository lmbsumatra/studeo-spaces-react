import React from 'react';
import Hero from '../components/hero/Hero';
import Service from '../components/services/Service';
import Blogs from '../components/blogs/Blogs';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

const HomeScreen = () => {

  return (
    <div>
      <Hero />
      <Service title="Top Services" show={3} isBookingPage={false} />
      <Blogs />
      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
