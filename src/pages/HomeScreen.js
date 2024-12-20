"use client";
import React from "react";
import Hero from "../components/hero/Hero";
import Service from "../components/services/Service";
import Blogs from "../components/blogs/Blogs";
import Feedback from "../components/feedback/Feedback";
import Footer from "../components/Footer";
import Messenger from "../Messenger";

const HomeScreen = () => {
  return (
    <div>
      <Hero />
      <Service title="Top Services" show={3} isBookingPage={false} />
      <Blogs />
      <Messenger />
      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
