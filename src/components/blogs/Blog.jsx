import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import { baseApiUrl } from "../../App";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${baseApiUrl}blogs`);
        const result = await res.json();
        setBlogs(result.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Function to handle image URL
  const showImage = (img) => {
    return img
      ? `${baseApiUrl}uploads/blogs/${img}`
      : 'https://placehold.co/600x400';
  };

  return (
    <div className="container">
      {/* Blog List */}
      {blogs.map((blog, index) => (
        <div className="row items mb-4" key={blog.id}>
          <div className={`col-sm-6 blog-img ${index % 2 === 0 ? '' : 'order-sm-2'}`}>
            <img
              src={showImage(blog.image)}
              alt=""
              width="800"
              height="300"
            />
          </div>
          <div className={`col-sm-6 blog-details ${index % 2 === 0 ? '' : 'order-sm-1'}`}>
            <h4 className="fs-500 ff-serif">{blog.title}</h4>
            <h5>{blog.subtitle || ''}</h5>
            <p>
              <i>
                {blog.shortDesc || ''}
              </i>
            </p>
            <a
              href={`/blogs-details/${blog.id}`}
              rel="noopener noreferrer"
              className="btn btn-primary-clr learn-more-button"
            >
              Learn More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
