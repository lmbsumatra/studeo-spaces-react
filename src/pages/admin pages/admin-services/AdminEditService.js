import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseApiUrl } from "../../../App";

const AdminEditService = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    images: "",
    description: "",
    count: "",
    availability: false, // Initial state for availability as boolean
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/services/${id}`
        );
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
          availability: data.availability === 1, // Convert to boolean
        });
      } catch (error) {
        setError({ general: error.message });
      } finally {
        setLoading(false);
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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "availability") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
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
      setLoading(true);
      const response = await fetch(`${baseApiUrl}services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          duration: formData.duration,
          price: formData.price,
          images: formData.images,
          description: formData.description,
          count: formData.count,
          availability: formData.availability ? 1 : 0,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update service");
      }
      
      toast.success(`Success! ${formData.name} is updated.`);
      navigate("/admin/services");
    } catch (error) {
      toast.error(`Error! ${error}`);
      setError({ general: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container items mt-5">
      <h1 className="fs-700 ff-serif text-center">Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${error.name && "is-invalid"}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          {error.name && <div className="invalid-feedback">{error.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Duration
          </label>
          <input
            type="text"
            className={`form-control ${error.duration && "is-invalid"}`}
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            disabled={loading}
          />
          {error.duration && (
            <div className="invalid-feedback">{error.duration}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className={`form-control ${error.price && "is-invalid"}`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={loading}
          />
          {error.price && <div className="invalid-feedback">{error.price}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images
          </label>
          <input
            type="text"
            className={`form-control ${error.images && "is-invalid"}`}
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
            disabled={loading}
          />
          {error.images && (
            <div className="invalid-feedback">{error.images}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className={`form-control ${error.description && "is-invalid"}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
          {error.description && (
            <div className="invalid-feedback">{error.description}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="count" className="form-label">
            Count
          </label>
          <input
            type="number"
            className={`form-control ${error.count && "is-invalid"}`}
            id="count"
            name="count"
            value={formData.count}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
          />
          <label htmlFor="availability" className="form-check-label">
            Available
          </label>
        </div>
        {error.general && (
          <div className="alert alert-danger">{error.general}</div>
        )}
        <button type="submit" className="btn btn-primary">
        {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Loading...
                      </>
                    ) : (
                      "Update Service"
                    )}
        </button>
       
      </form>
    </div>
  );
};

export default AdminEditService;
