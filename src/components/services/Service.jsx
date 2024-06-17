import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const Service = ({ title, show, isBookingPage, onServiceSelect, date, dateSelected }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let response = await fetch(`http://127.0.0.1:8000/api/services`);
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

    fetchServices();
  }, []); // Fetch services only once on component mount

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
                isBookingPage && selectedService === service.id ? "selected" : ""
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
                        onChange={() => handleServiceSelect(service)}
                        disabled={!dateSelected || service.count === 0} // Disable if date not selected or count is 0
                      />
                      <label
                        className={`btn btn-secondary-clr ${!dateSelected ? "disabled" : ""}`}
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
