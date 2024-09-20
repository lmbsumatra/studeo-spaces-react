import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Promo from "../promo/Promo";

const Service = ({
  title,
  show,
  isBookingPage,
  onServiceSelect,
  date,
  preselectedServiceId,
}) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        let response;
        if (isBookingPage) {
          response = await fetch(
            `http://127.0.0.1:8000/api/available?date=${date}`
          );
        } else {
          response = await fetch(`http://127.0.0.1:8000/api/services`);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isBookingPage && date) {
      fetchServices();
    } else if (!isBookingPage) {
      fetchServices();
    }
  }, [date, isBookingPage]);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/services-availability`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available seats");
        }
        const data = await response.json();
        setAvailable(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAvailableSeats();
  }, []);

  useEffect(() => {
    console.log("pre", preselectedServiceId);
    if (preselectedServiceId) {
      const id = Number(preselectedServiceId); // Convert to number if needed
      const serviceToSelect = services.find((service) => service.id === id);
      console.log(serviceToSelect);
      if (serviceToSelect) {
        setSelectedService(serviceToSelect);
        if (onServiceSelect) {
          onServiceSelect(serviceToSelect);
        }
      }
    }
  }, [services, preselectedServiceId, onServiceSelect]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  const handleBookClick = (service) => {
    navigate(`/booking?serviceId=${service}`);
  };

  return (
    <section className="container items" id="services">
      <h1 className="fs-700 ff-serif text-center">{title}</h1>
      {loading && !isBookingPage ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row flex-items">
          <Promo />
          {services.slice(0, show).map((service) => (
            <div className="cards col-lg-4 col-md-6 col-sm-12 mb-4 " key={service.id}>
              <div
                style={{ width: "17rem", height: "24rem" }}
                className={`card ${
                  isBookingPage && selectedService?.id === service.id
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
                  <div className="mt-auto">
                    {isBookingPage ? (
                      <>
                        <input
                          type="radio"
                          className="btn-check"
                          name="service"
                          id={`service${service.id}`}
                          autoComplete="off"
                          onChange={() => handleServiceSelect(service)}
                          checked={selectedService?.id === service.id}
                          disabled={service.availability === 0}
                        />
                        <label
                          className={`btn ${
                            service.availability === 0
                              ? "btn-danger"
                              : "btn-secondary-clr"
                          }`}
                          htmlFor={`service${service.id}`}
                        >
                          {selectedService?.id === service.id
                            ? "Selected"
                            : service.availability === 0
                            ? "Unavailable"
                            : "Select"}
                        </label>
                      </>
                    ) : (
                      <button
                        onClick={() => handleBookClick(service.id)}
                        className={`btn btn-primary-clr ${
                          service.availability === 0 ||
                          (available.length > 0
                            ? available.availability === 0
                            : "")
                            ? "disabled"
                            : ""
                        }`}
                      >
                        {service.availability === 0 ? "Unavailable" : "Book"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Service;
