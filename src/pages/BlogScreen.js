import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/blogs/style.css";
import Footer from "../components/Footer";
import Blogs from "../components/blogs/Blogs";

const Blog = () => {
  return (
    <div>
      <Blogs />
      <Footer />
    </div>
  );
};

export default Blog;
