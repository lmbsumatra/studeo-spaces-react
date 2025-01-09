import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import BlogCard from "../../../components/AdminBlog/BlogCard";
import { baseApiUrl } from "../../../App";

const AdminBlog = () => {

  const [adminBlog, setAdminBlogs] = useState();
  const [keyword, setKeyword] = useState('');

  const fetchBlogs = async () => {
    const res = await fetch(`${baseApiUrl}blogs/`);
    const result = await res.json();
    setAdminBlogs(result.data);
  };

  const searchBlogs = async () => {
    try {
      const res = await fetch(`${baseApiUrl}blogs?keyword=${keyword}`); // Use baseApiUrl
      const result = await res.json();
      setAdminBlogs(result.data);
    } catch (error) {
      // console.error("Error searching blogs:", error);
    }
  };

  useEffect(() => {
    // Fetch blogs based on the search keyword.
    if (keyword === "") {
      fetchBlogs(); // Load all blogs when the search field is cleared.
    } else {
      searchBlogs();
    }
  }, [keyword]); // Dependency array includes 'keyword'.

  useEffect(() => {
    fetchBlogs(); // Load all blogs on component mount.
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1 className="mb-4">Blogs</h1>
      </div>
      <div className='container'>
          <div className="d-flex justify-content-between pt-2">
              <a href="/admin/blogs-create" className='btn btn-success'>Create</a>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="justify-content-center pt-3">
               <div className="d-flex justify-content-between">
                  <input 
                    type="text" 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} 
                    className="form-control" 
                    placeholder="Search Blogs" 
                  />
              </div>
            </div>
          </form>
          
          <div className='row pt-5'>
            {
              adminBlog && adminBlog.map((blog) => (
                <BlogCard adminBlog={adminBlog} setAdminBlogs={setAdminBlogs} blog={blog} key={blog.id} />
              ))
            }
          </div>
      </div> 
    </>
  );
};

export default AdminBlog;
