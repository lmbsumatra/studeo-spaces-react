import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const AdminEditService = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    images: "",
    description: "",
    count: "",
    availability: false // Initial state for availability as boolean
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/services/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          duration: data.duration,
          price: data.price,
          images: data.images,
          description: data.description,
          count: data.count,
          availability: data.availability === 1 // Convert to boolean
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          availability: formData.availability ? 1 : 0 // Convert boolean to 1 or 0
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update service");
      }
      navigate('/admin-services');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="container items">
      <h1 className="fs-700 ff-serif text-center">Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${error && error.name && "is-invalid"}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {error && error.name && <div className="invalid-feedback">{error.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duration</label>
          <input
            type="text"
            className={`form-control ${error && error.duration && "is-invalid"}`}
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
          {error && error.duration && <div className="invalid-feedback">{error.duration}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${error && error.price && "is-invalid"}`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {error && error.price && <div className="invalid-feedback">{error.price}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="text"
            className={`form-control ${error && error.images && "is-invalid"}`}
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
          />
          {error && error.images && <div className="invalid-feedback">{error.images}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${error && error.description && "is-invalid"}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {error && error.description && <div className="invalid-feedback">{error.description}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="count" className="form-label">Count</label>
          <input
            type="number"
            className={`form-control ${error && error.count && "is-invalid"}`}
            id="count"
            name="count"
            value={formData.count}
            onChange={handleChange}
          />
          {error && error.count && <div className="invalid-feedback">{error.count}</div>}
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
        <button type="submit" className="btn btn-primary">Update Service</button>
      </form>
    </section>
  );
};

export default AdminEditService;
