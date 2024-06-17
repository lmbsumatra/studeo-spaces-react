import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const Service = ({ title, show, isBookingPage, onServiceSelect, date }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
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
        console.log("Fetched services:", data); // Debug: log the fetched data
        setServices(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (isBookingPage && date) {
      fetchServices();
    } else if (!isBookingPage) {
      fetchServices();
    }
  }, [date, isBookingPage]); // Fetch services when date or isBookingPage changes

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
        console.log("Fetched:", data); // Debug: log the fetched data
        setAvailable(data);
        // Handle the available seats data as needed
      } catch (error) {
        console.error(error);
      }
    };

    fetchAvailableSeats();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    if (onServiceSelect) {
      onServiceSelect(service); // Call the callback function with the selected service object
    }
  };

  return (
    <section className="container items">
      <h1 className="fs-700 ff-serif text-center">{title}</h1>
      <div className="row">
        {services.slice(0, show).map((service) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={service.id}>
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
                        {selectedService === service.id
                          ? "Selected"
                          : service.availability === 0
                          ? "Unavailable"
                          : "Select"}
                      </label>
                    </>
                  ) : (
                    <a
                      href="#"
                      className={`btn btn-primary-clr ${
                        service.availability === 0 || (available.length > 0 ? available.availability === 0 : "")? "disabled" : ""
                      }`}
                    >
                      {service.availability === 0
                        ? "Unavailable"
                        : "Book"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Service;
