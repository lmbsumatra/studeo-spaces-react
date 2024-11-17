import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseApiUrl } from "../../../App";

const AdminAddService = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
    count: "",
    availability: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);  // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(prev => ({
          ...prev,
          images: "Image size should be less than 5MB"
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError(prev => ({
          ...prev,
          images: "Please upload an image file"
        }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(prev => ({
        ...prev,
        images: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "availability") {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (!imageFile) {
      newErrors.images = "Image is required";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);  // Set loading state to true before sending the request
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'availability') {
          formDataToSend.append(key, formData[key] ? 1 : 0);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('image', imageFile);

      const response = await fetch(`${baseApiUrl}services`, {
        method: "POST",
        body: formDataToSend, // FormData will set the correct Content-Type header automatically
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }
      toast.success("New service has been added.");
      navigate('/admin/services');
      resetForm();  // Reset the form after successful submission
    } catch (error) {
      toast.error("Failed to add service.");
      setError({ general: error.message });
    } finally {
      setLoading(false);  // Set loading state to false once the request is done
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      duration: "",
      price: "",
      description: "",
      count: "",
      availability: false
    });
    setImageFile(null);
    setImagePreview(null);
    setError({});
  };

  return (
    <section className="container items mt-5">
      <h1 className="fs-700 ff-serif text-center">Add Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${error.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {error.name && <div className="invalid-feedback">{error.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duration</label>
          <input
            type="text"
            className={`form-control ${error.duration ? "is-invalid" : ""}`}
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
          {error.duration && <div className="invalid-feedback">{error.duration}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${error.price ? "is-invalid" : ""}`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {error.price && <div className="invalid-feedback">{error.price}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">Upload Image</label>
          <input
            type="file"
            className={`form-control ${error.images ? "is-invalid" : ""}`}
            id="images"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
          />
          {error.images && <div className="invalid-feedback">{error.images}</div>}
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="img-thumbnail" 
                style={{ maxWidth: '200px' }} 
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${error.description ? "is-invalid" : ""}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {error.description && <div className="invalid-feedback">{error.description}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="count" className="form-label">Count</label>
          <input
            type="number"
            className={`form-control ${error.count ? "is-invalid" : ""}`}
            id="count"
            name="count"
            value={formData.count}
            onChange={handleChange}
          />
          {error.count && <div className="invalid-feedback">{error.count}</div>}
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
          <label htmlFor="availability" className="form-check-label">Available</label>
        </div>

        {error.general && <div className="alert alert-danger">{error.general}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}> 
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </form>
    </section>
  );
};

export default AdminAddService;
