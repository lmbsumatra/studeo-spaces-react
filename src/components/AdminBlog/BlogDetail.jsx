import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import "./style.css";
import { baseApiUrl } from "../../App";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null); // Initial state as null
  const params = useParams();

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${baseApiUrl}blogs/${params.id}`);
      const result = await res.json();
      setBlog(result.data || null); // Set blog data or null if no data
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(null); // Handle error by setting blog to null
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []); // Run once when the component mounts

  if (!blog) {
    return <div className="text-center mt-5">Loading or no blog found...</div>; // Fallback UI
  }

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between pt-5">
          <h1>{blog?.title || 'Loading...'}</h1> {/* Loading fallback */}
          <div>
            <a href="/admin/blogs" className="btn btn-warning">
              Back to Blog
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              by <strong>{blog?.author || 'Unknown Author'}</strong> on {blog?.date || 'Unknown Date'}
            </p>

            <div className="mt-5">
              {blog?.image && (
                <img
                  className="w-50"
                  src={blog.image}
                  alt="Blog"
                />
              )}
            </div>

            <div
              className="mt-5"
              dangerouslySetInnerHTML={{ __html: blog?.description || '' }} // Handle missing description
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
