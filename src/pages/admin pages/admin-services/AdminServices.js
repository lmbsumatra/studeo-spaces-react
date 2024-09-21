import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const AdminServices = ({
  title,
  show,
  isBookingPage,
  onServiceSelect,
  date,
}) => {
  const [services, setServices] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingServiceIds, setLoadingServiceIds] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/services`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
        

        // Fetch available seats from the new endpoint
        const seatsResponse = await fetch(
          `http://127.0.0.1:8000/api/available`
        );
        if (!seatsResponse.ok) {
          throw new Error("Failed to fetch available seats");
        }
        const seatsData = await seatsResponse.json();

        // Transform available seats data into an object
        const availableSeatsMap = {};
        seatsData.forEach((item) => {
          availableSeatsMap[item.service_id] = item.available_seats;
        });
        setAvailableSeats(availableSeatsMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if ((isBookingPage && date) || !isBookingPage) {
      fetchServices();
    }
  }, [date, isBookingPage]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deletedService = id;
      const response = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete service");
      }
      setServices(services.filter((service) => service.id !== id));
      toast.success(`Successfully deleted: service: ${deletedService}`);
    } catch (error) {
      setError(error.message);
      toast.error("Error deleting service.");
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    console.log(currentAvailability)
    const newAvailability = currentAvailability >= 1 ? 0 : 1; // Toggle the availability

    try {
      setLoadingServiceIds((prev) => ({ ...prev, [id]: true }));

      // Optimistically update the state immediately
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id
            ? { ...service, availability: newAvailability }
            : service
        )
      );

      const response = await fetch(
        `http://127.0.0.1:8000/api/services-availability/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availability: newAvailability }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service availability");
      }

      // After successfully updating, refetch available seats
      const seatsResponse = await fetch(`http://127.0.0.1:8000/api/available`);
      if (!seatsResponse.ok) {
        throw new Error("Failed to fetch available seats");
      }
      const seatsData = await seatsResponse.json();

      // Update available seats state
      const availableSeatsMap = {};
      seatsData.forEach((item) => {
        availableSeatsMap[item.service_id] = item.available_seats;
      });
      setAvailableSeats(availableSeatsMap);

      toast.success(`Successfully changed availability for ${id}.`);
    } catch (error) {
      setError(error.message);
      toast.error("Error changing availability.");
      // Revert optimistic update on error
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id
            ? { ...service, availability: currentAvailability }
            : service
        )
      );
    } finally {
      setLoadingServiceIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/edit-service/${id}`);
  };

  return (
    <section className="container items mt-5">
      <h1 className="fs-700 ff-serif text-center">{title}</h1>
      <div className="mt-4">
        <Link to="/admin/add-service" className="btn btn-success">
          Add Service
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {error && <p>Error: {error}</p>}
          <div className="row">
            {services.slice(0, show).map((service) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 mb-4"
                key={service.id}
              >
                <div
                  style={{ width: "17rem", height: "24rem" }}
                  className={`card ${
                    isBookingPage && selectedService === service.id
                      ? "selected"
                      : ""
                  }`}
                >
                  <img
                    src={service.images}
                    className="card-img-top"
                    alt={service.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title ff-serif">{service.name}</h5>
                    <p className="card-text text-accent fs-300">
                      {service.description}
                    </p>
                    <p className="card-text fs-500 text-clr-green">
                      ₱ {service.price}
                    </p>
                    <div className="mt-auto d-flex justify-content-between">
                      {isBookingPage ? (
                        <>
                          <input
                            type="radio"
                            className="btn-check"
                            name="service"
                            id={`service${service.id}`}
                            autoComplete="off"
                            onChange={() => handleServiceSelect(service)}
                            disabled={availableSeats[service.id] === 0}
                          />
                          <label
                            className="btn btn-secondary-clr"
                            htmlFor={`service${service.id}`}
                          >
                            {selectedService === service.id
                              ? "Selected"
                              : "Select"}
                          </label>
                          {availableSeats[service.id] === 0 && (
                            <span className="text-danger">Unavailable</span>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(service.id)}
                            className="btn btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(service.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        className={`btn ${
                          service.availability === 0
                            ? "btn-outline-danger "
                            : "btn-success"
                        }`}
                        onClick={() =>
                          handleToggleAvailability(
                            service.id,
                            service.availability
                          )
                        }
                        disabled={loadingServiceIds[service.id]}
                      >
                        {loadingServiceIds[service.id] ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <>
                            {service.availability === 0
                              ? "Unavailable"
                              : "Available"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default AdminServices;
