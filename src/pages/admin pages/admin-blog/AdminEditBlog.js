import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { baseApiUrl } from "../../../App";

const AdminEditBlog = () => {
  const [html, setHtml] = useState('');
  const [imageFile, setImageFile] = useState(null); // Store the new image file
  const [htmlError, setHtmlError] = useState(false);
  const [blog, setBlog] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save the selected image file
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${baseApiUrl}blogs/${params.id}`);
      const result = await res.json();
      if (result.status) {
        setBlog(result.data);
        setHtml(result.data.description);
        reset(result.data); // Populate the form with existing blog data
      } else {
        toast.error("Failed to fetch blog details.");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const formSubmit = async (data) => {
    if (!html || html.trim() === "") {
        setHtmlError(true);
        return;
    }
    setHtmlError(false);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("shortDesc", data.shortDesc);
    formData.append("description", html);

    if (imageFile) {
        formData.append("image", imageFile); // Add new image if uploaded
    }

    // Add `_method` to simulate a PUT request
    formData.append("_method", "PUT");

    try {
        const res = await fetch(`${baseApiUrl}blogs/${params.id}`, {
            method: "POST", // Use POST to simulate PUT
            body: formData,
        });

        const result = await res.json();

        if (result.status) {
            toast.success("Blog Updated Successfully.");
            navigate('/admin/blogs');
        } else {
            toast.error("Blog Update Failed: " + result.message);
        }
    } catch (error) {
        console.error("Error updating blog:", error);
        toast.error("Failed to update blog.");
    }
};

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className='container'>
      <div className="d-flex justify-content-between pt-5 mb-5">
        <h4>Edit Blog</h4>
        <a href="/admin/blogs" className='btn btn-success'>Back</a>
      </div>
      <div className='card border-0 shadow-lg'>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>Title</label>
              <input
                {...register('title', { required: true })}
                type="text"
                className={`form-control ${errors.title && 'is-invalid'}`}
                placeholder='Title'
              />
              {errors.title && <p className='invalid-feedback'>Title field is required</p>}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Short Description</label>
              <textarea
                {...register('shortDesc', { required: true })}
                cols="30"
                rows="5"
                className={`form-control ${errors.shortDesc && 'is-invalid'}`}
              ></textarea>
              {errors.shortDesc && <p className='invalid-feedback'>Short description is required</p>}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Description</label>
              <div style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', maxHeight: '300px', overflow: 'auto' }}>
                <Editor
                  value={html}
                  containerProps={{ style: { height: '300px', overflow: 'auto', padding: '10px' } }}
                  onChange={(e) => setHtml(e.target.value)}
                />
              </div>
              {htmlError && <p className='invalid-feedback'>Description is required</p>}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Image</label>
              <input onChange={handleFileChange} type="file" className='form-control' />
              {blog.image && (
                <div className='mt-3'>
                  <img
                    src={blog.image}
                    alt="Current Blog"
                    style={{ maxHeight: "150px", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Author</label>
              <input
                {...register('author', { required: true })}
                type="text"
                className={`form-control ${errors.author && 'is-invalid'}`}
                placeholder='Author'
              />
              {errors.author && <p className='invalid-feedback'>Author field is required</p>}
            </div>
            <button className='btn btn-success'>Update Blog</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBlog;
