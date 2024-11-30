import React, { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminCreate = () => {
  const [html, setHtml] = useState('');
  const [imageId, setImageId] = useState('');
  const [htmlError, setHtmlError] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setHtml(e.target.value);
  }

  const handleFileChange = async(e) => {
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append("image",file);

    const res = await fetch("http://localhost:8000/api/save-temp-image/", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    console.log(result);

    if(result.status == false){
      alert(result.errors.image);
      e.target.value = null;
    }

    setImageId(result.image.id);

  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async(data) => {
    const newData = { ...data, "description": html, image_id: imageId };


    const res = await fetch("http://localhost:8000/api/blogs",{
      method: "POST",
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(newData)
    });

    if (!html || html.trim() === "") {
      setHtmlError(true);
      return;
    }
    setHtmlError(false);
    toast.success("Blog Added Successfully.");
    navigate('/admin/blogs');
    // console.log(newData);
  };

  

  return (
    <div className='container'>
        <div className="d-flex justify-content-between pt-5 mb-5">
            <h4>Create Blog</h4>
            <a href="/admin/blogs" className='btn btn-success'>Back</a>
        </div>
        <div className='card border-0 shadow-lg'>
          <form onSubmit={handleSubmit(formSubmit)}>
          <div className='card-body'>
            <div className='mb-10'>
              <label className='form-label'>Title</label>
              <input
                  {...register('title', {
                    required: "Title is required",  // Custom error message if the title is empty
                    minLength: {
                      value: 10,                      // Minimum length of 10 characters
                      message: "Title must be at least 10 characters" // Custom error message
                    }
                  })}
                  type="text"
                  className={`form-control ${errors.title && 'is-invalid'}`}
                  placeholder="Title"
                />
                {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Short Description</label>
              <textarea { ...register('shortDesc', { required: true }) } 
                cols="30" 
                rows="5" 
                className={`form-control ${errors.shortDesc && 'is-invalid'}`}>
              </textarea>
              {errors.shortDesc && <p className='invalid-feedback'>Short description is required</p>}
            </div>

            <div className='mb-3'>
              <label className='form-label'>Description</label>
              <div style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', maxHeight: '300px', overflow: 'auto' }}>
              <Editor 
                value={html} 
                containerProps={{ style: { height: '300px', overflow: 'auto', padding: '10px' } }} 
                onChange={onChange} 
              />
            </div>
              {htmlError && <p className='invalid-feedback'>Description is required</p>}
            </div>
            
            <div className='mb-3'>
              <label className='form-label'>Image</label>
              <input onChange={handleFileChange} type="file" className='form-control' />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Author</label>
              <input { ...register('author',{required: true}) } 
                type="text" 
                className={`form-control ${errors.author && 'is-invalid'}`}
                placeholder='Author' />
                {errors.author && <p className='invalid-feedback'>Author field is required</p>}
            </div>

            <button className='btn btn-success'>Create</button>
          </div>
          </form>
        </div>
    </div>
  );
};

export default AdminCreate;
