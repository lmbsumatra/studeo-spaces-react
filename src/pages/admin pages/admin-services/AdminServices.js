import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { baseApiUrl } from "../../../App";
import MappingOverview from "./mapping/MappingOverview";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingServiceIds, setLoadingServiceIds] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isMappingActive, setMappingActive] = useState(false);
  const [isOverlayActive, setOverlayActive] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseApiUrl}services`);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [date]);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      const formattedDate = date.toLocaleDateString("en-CA");
      if (formattedDate) {
        try {
          const response = await fetch(
            `${baseApiUrl}available?date=${formattedDate}`
          );
          if (!response.ok) throw new Error("Failed to fetch available seats.");
          const data = await response.json();
          setAvailableSeats(data);
        } catch (error) {
          setError(error.message);
        }
      }
    };
    fetchAvailableSeats();
  }, [date]);

  const handleDelete = async (id) => {
    setLoadingServiceIds((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`${baseApiUrl}services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      setServices(services.filter((service) => service.id !== id));
      toast.success(`Successfully deleted service: ${id}`);
    } catch (error) {
      setError(error.message);
      toast.error("Error deleting service.");
    } finally {
      setLoadingServiceIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    const newAvailability = currentAvailability === 1 ? 0 : 1;
    setLoadingServiceIds((prev) => ({ ...prev, [id]: true }));

    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? { ...service, availability: newAvailability }
          : service
      )
    );

    try {
      const response = await fetch(`${baseApiUrl}services-availability/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newAvailability }),
      });
      if (!response.ok) throw new Error("Failed to update availability");
      toast.success(`Successfully changed availability for ${id}.`);
    } catch (error) {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id
            ? { ...service, availability: currentAvailability }
            : service
        )
      );
      toast.error("Error changing availability: " + error.message);
    } finally {
      setLoadingServiceIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-service/${id}`);
  };

  const handleViewMapping = () => {
    setMappingActive((prev) => !prev);
    setOverlayActive((prev) => !prev);
  };

  const handleCloseOverlay = () => {
    setMappingActive(false);
    setOverlayActive(false);
  };

  return (
    <section className="container items mt-5" id="admin-services">
      <h1 className="fs-700 ff-serif text-center">Admin Services</h1>
      <div className="mt-4">
        <Link to="/admin/add-service" className="btn btn-success">
          Add Service
        </Link>
        <button className="btn btn-primary" onClick={handleViewMapping}>
          Overview
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {error && <p>Error: {error}</p>}
          <div className="row">
            {services.map((service) => {
              const seatData = availableSeats.find(
                (seat) => seat.service_id === service.id
              );
              const availableCount = seatData ? seatData.available_seats : 0;
              return (
                <div
                  className="col-lg-4 col-md-6 col-sm-12 mb-4"
                  key={service.id}
                >
                  <div
                    className="card"
                    style={{ width: "17rem", height: "26rem" }}
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
                        <button
                          onClick={() => handleEdit(service.id)}
                          className="btn btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(service.id)}
                          disabled={loadingServiceIds[service.id]}
                        >
                          {loadingServiceIds[service.id] ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                        <button
                          className={`btn ${
                            service.availability === 0
                              ? "btn-outline-danger"
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
                            <Spinner animation="border" size="sm" />
                          ) : service.availability === 0 ? (
                            "Unavailable"
                          ) : (
                            "Available"
                          )}
                        </button>
                      </div>
                      <span className="d-flex">
                        Available Seats Today: {availableCount}
                      </span>
                      <span className="d-flex">
                        Availability:{" "}
                        {service.availability === 1 ? (
                          <p className="text-success"> Available</p>
                        ) : (
                          <p className="text-danger"> Not Available</p>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <MappingOverview
        isActive={isMappingActive}
        onClose={() => setMappingActive(false)}
      />
    </section>
  );
};

export default AdminServices;
