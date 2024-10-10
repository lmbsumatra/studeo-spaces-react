"use client";
import React from "react";
import Hero from "../components/hero/Hero";
import Service from "../components/services/Service";
import Blogs from "../components/blogs/Blogs";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";
import { FacebookProvider, CustomChat } from "react-facebook";

const HomeScreen = () => {
  return (
    <div>
      <Hero />
      <Service title="Top Services" show={3} isBookingPage={false} />
      <FacebookProvider appId="1055141332568092" chatSupport>
        <CustomChat pageId="472319582623972" minimized={true} />
      </FacebookProvider>
      <Blogs />

      <Feedback />
      <Footer />
    </div>
  );
};

export default HomeScreen;
