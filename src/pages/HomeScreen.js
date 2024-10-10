"use client";
import React from "react";
import Hero from "../components/hero/Hero";
import Service from "../components/services/Service";
import Blogs from "../components/blogs/Blogs";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";
import { FacebookProvider, CustomChat } from "react-facebook";
import Messenger from "../Messenger";

const HomeScreen = () => {
  return (
    <div>
      <Hero />
      HELLLOOO
      <Service title="Top Services" show={3} isBookingPage={false} />
      <Blogs />
      HELLLOOO
      <Messenger />
      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
