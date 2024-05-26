import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DesignSystem from "./pages/DesignSystem.js";
import Home from "./pages/home/Home.js";
import Blogs from "./pages/blogs/Blogs.js";
import Services from "./pages/services/Services.js";
import Faqs from "./pages/faqs/Faqs.js";
import Book from "./pages/book/Book.js";

import "./index.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/book" element={<Book />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
