import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseApiUrl } from "../../../App";
import { debounce } from "lodash";

const AdminEditService = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    duration: "",
    price: "",
    images: null,
    description: "",
    count: "",
    availability: false,
    seats: [],
    service_code: "",
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
        // console.log(data);
        // Then proceed with setting form data
        setFormData({
          name: data.service.name,
          type: data.service.type,
          duration: data.service.duration,
          price: data.service.price ? data.service.price.toString() : "",
          images: data.service.images,
          description: data.service.description || "",
          count: data.service.count?.toString() || "",
          availability: Boolean(data.service.availability),
          seats: data.service.seats.map((seat) => ({
            ...seat,
            booking_count_today: seat.booking_count_today || 0, // Ensure the booking count is included
          })),
          service_code: data.service.service_code,
          booked_seat_codes_today: data.booked_seat_codes_today,
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

  const generateSeats = debounce((count, serviceCode) => {
    const bookedSeatCodes = formData.booked_seat_codes_today || []; // Get the booked seat codes for today
    // console.log("Booked seats for today:", bookedSeatCodes); // Log the booked seat codes

    // Step 1: Get the current list of seat codes
    const currentSeatsCount = formData.seats.length;
    // console.log("Current seats count:", currentSeatsCount);

    // Step 2: Calculate how many new seats are needed
    const seatsToGenerateCount = count - currentSeatsCount;

    // If no new seats are needed, return
    if (seatsToGenerateCount <= 0) {
      // console.log("No new seats to generate.");
      return;
    }

    // Step 3: Generate new seats with updated seat codes
    const updatedSeats = [];
    for (let i = 0; i < seatsToGenerateCount; i++) {
      const lastSeatCode =
        formData.seats[formData.seats.length - 1]?.seat_code ||
        `${serviceCode}-0`;
      const lastSeatNumber = parseInt(lastSeatCode.split("-")[1], 10); // Extract the seat number from the code (e.g., "ADAN-5" => 5)
      // console.log("Last seat number:", lastSeatNumber);

      const nextSeatNumber = lastSeatNumber + i + 1; // Calculate the next seat number
      const seatCode = `${serviceCode}-${nextSeatNumber}`; // Generate the seat code based on the serviceCode

      // Check if the seat code already exists in the current list of seats
      if (!formData.seats.some((seat) => seat.seat_code === seatCode)) {
        const isBooked = bookedSeatCodes.includes(seatCode); // Check if this seat is booked

        // console.log(`Generating seat: ${seatCode}, isBooked: ${isBooked}`);

        updatedSeats.push({
          seat_code: seatCode,
          booked: isBooked,
          floor_number: "", // Placeholder; adjust as needed
          booking_count_today: 0, // Placeholder; adjust as needed
        });
      }
    }

    // console.log("Newly generated seats:", updatedSeats); // Log the newly generated seats

    // Step 4: Combine the new seats with the existing ones
    const allSeats = [...formData.seats, ...updatedSeats];

    // console.log("All seats after adding new ones:", allSeats); // Log the full list of seats (old + new)

    // Step 5: Update the form data with the new seat list
    setFormData((prevFormData) => ({
      ...prevFormData,
      seats: allSeats, // Set the full list of seats
    }));
  }, 300);

  const adjustSeatsAfterDecrease = (newCount) => {
    const bookedSeatCodes = formData.booked_seat_codes_today || []; // Get the booked seats

    // Step 1: Filter out the booked seats, and also ensure the total count respects the new count.
    const updatedSeats = formData.seats.filter((seat, index) => {
      // Step 1.1: Always keep booked seats
      if (bookedSeatCodes.includes(seat.seat_code)) {
        return true;
      }

      // // Step 1.2: For unbooked seats, keep them only if they are within the new count limit
      // return index < newCount;
    });

    // Step 2: Update the form data with the new seats list
    setFormData((prevFormData) => ({
      ...prevFormData,
      seats: updatedSeats, // Update the seats after decreasing
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => {
      let updatedForm = {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };

      // Automatically regenerate seats when count changes
      if (name === "count" && value && !isNaN(value)) {
        const newCount = parseInt(value, 10);
        const bookedSeatsCount = prevFormData.booked_seat_codes_today.length;

        // Step 1: Prevent reducing seat count below the number of booked seats
        if (newCount < bookedSeatsCount) {
          // Set error message and prevent the change
          setError((prevError) => ({
            ...prevError,
            count: `Cannot remove booked seats. Currently, ${bookedSeatsCount} seats are booked today.`,
          }));
          return prevFormData; // Return the previous form data to prevent count change
        } else if (newCount < prevFormData.count) {
          // Decrease the count - remove excess seats
          adjustSeatsAfterDecrease(newCount);
        } else {
          // Remove the error if count is valid
          setError((prevError) => {
            const { count, ...rest } = prevError;
            return rest;
          });
          generateSeats(newCount, prevFormData.service_code); // Regenerate seats
        }
      }

      return updatedForm;
    });
  };

  const handleSeatChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSeats = [...formData.seats];

    // Update the specific seat's field
    updatedSeats[index][name] = value;

    // Filter out the seats based on the new count while keeping booked seats intact
    const bookedSeatCodes = formData.booked_seat_codes_today || [];

    // Filter the seats to ensure booked ones are retained
    const filteredSeats = updatedSeats.filter((seat, idx) => {
      // Keep booked seats or seats within the new count limit
      return bookedSeatCodes.includes(seat.seat_code) || idx < formData.count;
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      seats: filteredSeats, // Updated seat list
      count: filteredSeats.length, // Automatically update count based on seats
    }));
  };

  useEffect(() => {
    if (formData.count && formData.service_code) {
      generateSeats(parseInt(formData.count, 10), formData.service_code);
    }
  }, [formData.count, formData.service_code]);

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

    // Validate that each seat has a valid floor_number
    formData.seats.forEach((seat, index) => {
      if (seat.floor_number && isNaN(seat.floor_number)) {
        newErrors[`floor_number_${index}`] =
          "Floor number must be a valid number";
      }
    });

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
      updateData.append("type", formData.type.trim());
      updateData.append("duration", formData.duration.trim());
      updateData.append("price", Number(formData.price));
      updateData.append("description", formData.description.trim());
      updateData.append("count", Number(formData.count));
      updateData.append("availability", formData.availability ? 1 : 0);
      updateData.append("service_code", formData.service_code);
      // Exclude booking_count_today from being sent to the backend
      const seatsWithoutBookingCount = formData.seats.map((seat) => {
        const { booking_count_today, ...seatWithoutBookingCount } = seat;
        return seatWithoutBookingCount; // Exclude booking count when sending to backend
      });
      updateData.append("seats", JSON.stringify(seatsWithoutBookingCount));

      // Append image if a new one was selected
      if (imageFile) {
        // console.log(imageFile);
        updateData.append("images", imageFile);
      }
      // Iterate over FormData to log all key-value pairs
      for (let pair of updateData.entries()) {
        // console.log(`${pair[0]}: ${pair[1]}`);
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
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <select
            className={`form-control ${error.type ? "is-invalid" : ""}`}
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Type</option>
            <option value="room">Room</option>
            <option value="desk">Desk</option>
          </select>
          {error.type && <div className="invalid-feedback">{error.type}</div>}
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
          {imagePreview ||
            (formData.images && (
              <div className="mt-2">
                <img
                  src={imagePreview || formData.images}
                  alt="Service preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                  className="mt-2 img-thumbnail"
                />
              </div>
            ))}
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
          <label htmlFor="service_code" className="form-label">
            Service Code
          </label>
          <input
            type="text"
            className={`form-control ${error.service_code ? "is-invalid" : ""}`}
            id="service_code"
            name="service_code"
            value={formData?.service_code}
            onChange={handleChange}
            disabled={loading}
          />
          {error.service_code && (
            <div className="invalid-feedback">{error.service_code}</div>
          )}
        </div>

        <div className="mb-3">
          {}
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
            min="0"
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

        {/* Seats Display */}
        <div className="mb-3">
          <label>{formData.type === "room" ? " Room" : "Seats"}</label>
          {formData.seats.map((seat, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Seat Code"
                value={seat.seat_code}
                readOnly // Seat Code is auto-generated
                disabled={loading}
              />
              <input
                type="number"
                className="form-control me-2"
                placeholder="Floor Number"
                name="floor_number" // Use the name attribute to match the seat property
                value={seat.floor_number}
                onChange={(e) => handleSeatChange(index, e)} // Handle changes here
                disabled={loading}
              />
              {error[`floor_number_${index}`] && (
                <div className="invalid-feedback">
                  {error[`floor_number_${index}`]}{" "}
                  {/* Show error for each floor number */}
                </div>
              )}
            </div>
          ))}
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
