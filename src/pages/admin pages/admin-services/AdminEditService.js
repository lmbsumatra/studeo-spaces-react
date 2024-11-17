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
    images: null,
    description: "",
    count: "",
    availability: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseApiUrl}services/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          duration: data.duration,
          price: data.price?.toString() || "",
          images: data.images,
          description: data.description || "",
          count: data.count?.toString() || "",
          availability: Boolean(data.availability),
        });
        // Set image preview if exists
        if (data.images) {
          setImagePreview(data.images);
        }
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.duration?.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.count || isNaN(Number(formData.count))) {
      newErrors.count = "Valid count is required";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields correctly.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create FormData instance
      const updateData = new FormData();
      updateData.append("name", formData.name.trim());
      updateData.append("duration", formData.duration.trim());
      updateData.append("price", Number(formData.price));
      updateData.append("description", formData.description.trim());
      updateData.append("count", Number(formData.count));
      updateData.append("availability", formData.availability ? 1 : 0);

      // Append image if a new one was selected
      if (imageFile) {
        console.log(imageFile)
        updateData.append("image", imageFile);
      }
      // Iterate over FormData to log all key-value pairs
      for (let pair of updateData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const response = await fetch(`${baseApiUrl}services/${id}`, {
        method: "POST", // Using POST instead of PATCH for FormData
        headers: {
          Accept: "application/json",
          // Don't set Content-Type header when sending FormData
        },
        body: updateData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update service");
      }

      toast.success(`Success! ${formData.name} is updated.`);
      navigate("/admin/services");
    } catch (error) {
      toast.error(`Error! ${error.message}`);
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
            Service Image
          </label>
          <input
            type="file"
            className={`form-control ${error.images && "is-invalid"}`}
            id="images"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {error.images && (
            <div className="invalid-feedback">{error.images}</div>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Service preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
                className="mt-2 img-thumbnail"
              />
            </div>
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
            rows="4"
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
          <label className="form-check-label" htmlFor="availability">
            Available
          </label>
        </div>

        {error.general && (
          <div className="alert alert-danger">{error.general}</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Updating...
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
