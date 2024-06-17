import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const AdminAddService = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    images: "",
    description: "",
    count: "",
    availability: 0 // Initial state for availability as boolean
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "availability") {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          availability: formData.availability ? 1 : 0 // Convert boolean to 1 or 0
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add service");
      }
      navigate('/admin-services');
    } catch (error) {
      setError({ general: error.message });
    }
  };

  return (
    <section className="container items">
      <h1 className="fs-700 ff-serif text-center">Add Service</h1>
      <form onSubmit={handleSubmit}>
        {/* Other form fields */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${error.name && "is-invalid"}`}
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
            className={`form-control ${error.duration && "is-invalid"}`}
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
            className={`form-control ${error.price && "is-invalid"}`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {error.price && <div className="invalid-feedback">{error.price}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="text"
            className={`form-control ${error.images && "is-invalid"}`}
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
          />
          {error.images && <div className="invalid-feedback">{error.images}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${error.description && "is-invalid"}`}
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
            className={`form-control ${error.count && "is-invalid"}`}
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
        <button type="submit" className="btn btn-primary">Add Service</button>
      </form>
    </section>
  );
};

export default AdminAddService;
