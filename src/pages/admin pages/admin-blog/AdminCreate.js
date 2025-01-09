import React, { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseApiUrl } from "../../../App";

const AdminCreate = () => {
    const [html, setHtml] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [htmlError, setHtmlError] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setImageFile(file); // Save the selected file
                console.log("Selected file:", file); // Debug log
            }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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
            formData.append("image", imageFile);
        }
    
        // Debug: Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            const res = await fetch(`${baseApiUrl}blogs`, {
                method: "POST",
                body: formData,
            });
    
            const result = await res.json();
    
            if (result.status) {
                toast.success("Blog Added Successfully.");
                navigate('/admin/blogs');
            } else {
                toast.error(result.message || "Failed to create blog.");
            }
        } catch (error) {
            console.error("Error submitting blog:", error);
            toast.error("Failed to create blog.");
        }
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
                                    required: "Title is required",
                                    minLength: {
                                        value: 10,
                                        message: "Title must be at least 10 characters",
                                    },
                                })}
                                type="text"
                                className={`form-control ${errors.title && 'is-invalid'}`}
                                placeholder="Title"
                            />
                            {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
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
                              containerProps={{ style: { height: '300px', overflow: 'auto', padding: '10px' } }} onChange={(e) => setHtml(e.target.value)} />
                            </div>
                            {htmlError && <p className='invalid-feedback'>Description is required</p>}
                        </div>
                        <div className='mb-3'>
                            <label className="form-label">Image</label>
                            <input onChange={handleFileChange} type="file" className="form-control" />
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
                        <button className='btn btn-success'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreate;
