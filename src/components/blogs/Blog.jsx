import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // Number of blogs to display per page

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/blogs');
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
      ? `http://localhost:8000/uploads/temp/${img}`
      : 'https://placehold.co/600x400';
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container">
      {/* Blog List */}
      {currentBlogs.map((blog, index) => (
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
