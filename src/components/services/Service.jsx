import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const Service = ({ title, show, isBookingPage }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // State to store selected service

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  // Function to handle service selection
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
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
                isBookingPage && selectedService === service.id ? "selected" : ""
              }`}
            >
              <img
                src={service.image}
                className="card-img-top"
                alt={service.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title ff-serif">{service.name}</h5>
                <p className="card-text text-accent fs-300">
                  {service.description}
                </p>
                <p className="card-text fs-500 text-clr-green">₱ {service.price}</p>
                <div className="mt-auto">
                  {isBookingPage ? (
                    <>
                      <input
                        type="radio"
                        className="btn-check"
                        name="service"
                        id={`service${service.id}`}
                        autoComplete="off"
                        onChange={() => handleServiceSelect(service.id)}
                      />
                      <label
                        className="btn btn-secondary-clr"
                        htmlFor={`service${service.id}`}
                      >
                        {selectedService === service.id ? "Selected" : "Select"}
                      </label>
                    </>
                  ) : (
                    <a href="#" className="btn btn-primary-clr">
                      Go somewhere
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
