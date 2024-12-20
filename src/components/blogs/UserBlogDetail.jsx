import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import "./style.css";
import { baseApiUrl } from "../../App";

const UserBlogDetail = () => {
  const [blog, setBlog] = useState([]);
  const params = useParams();

  const fetchBlog = async () => {
    const res = await fetch(`${baseApiUrl}blogs/${params.id}`);
    const result = await res.json();
    setBlog(result.data);
    // console.log(params.id)
  };
  
  useEffect(() => {
    fetchBlog();
  }, []); // Added empty dependency array to prevent infinite re-renders

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between pt-5">
          <h1>{blog.title}</h1>
          <div>
            <a href="/blogs" className="btn btn-warning">
              Back to Blog
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              by <strong>{blog.author}</strong> on {blog.date}
            </p>

            <div className="mt-5">
              {blog.image && (
                <img
                  className="w-50"
                  src={`${baseApiUrl}uploads/blogs/${blog.image}`}
                  alt="Blog"
                />
              )}
            </div>

            <div
              className="mt-5"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlogDetail;
