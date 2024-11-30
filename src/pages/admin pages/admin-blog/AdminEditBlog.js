import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const EditBlog = () => {

  const [html, setHtml] = useState('');
  const [imageId, setImageId] = useState('');
  const [htmlError, setHtmlError] = useState(false);
  const navigate = useNavigate();
  const [blog, setBlog] = useState([]);
  const params = useParams();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

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

  const fetchBlog = async () => {
    const res = await fetch ("http://localhost:8000/api/blogs/"+ params.id)
    const result = await res.json();
    setBlog(result.data);
    setHtml(result.data.description)
    reset(result.data);

    // console.log(params.id)

  }

  const formSubmit = async(data) => {
    const newData = { ...data, "description": html, image_id: imageId };


    const res = await fetch("http://localhost:8000/api/blogs/"+params.id,{
      method: "PUT",
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
    toast.success("Blog Updated Successfully.");
    navigate('/admin/blogs');
    // console.log(newData);
  };

  useEffect(() => {
    fetchBlog();

  },[])



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
          <input  { ...register('title',{required: true}) } 
            type="text" 
            className={`form-control ${errors.title && 'is-invalid'}`}
            placeholder='Title' />
            {errors.title && <p className='invalid-feedback'>Title field is required</p>}
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
            <div className='mt-3'>
            {
                    (blog.image) && 
                    <img style={{ width: '20%', height: 'auto'}} src={`http://localhost:8000/uploads/blogs/${blog.image}`} />
                }
            </div>
        </div>

        <div className='mb-3'>
          <label className='form-label'>Author</label>
          <input { ...register('author',{required: true}) } 
            type="text" 
            className={`form-control ${errors.author && 'is-invalid'}`}
            placeholder='Author' />
            {errors.author && <p className='invalid-feedback'>Author field is required</p>}
        </div>

        <button className='btn btn-success'>Update Blog</button>
      </div>
      </form>
    </div>
</div>
  )
}

export default EditBlog
