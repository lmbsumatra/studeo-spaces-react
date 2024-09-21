import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Promo from "../promo/Promo";
import Tooltip from "@mui/material/Tooltip";

const Service = ({
  title,
  show,
  isBookingPage,
  onServiceSelect,
  preselectedServiceId,
}) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  // Fetch services and available seats on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        setLoading(true);

        const serviceResponse = await fetch(
          "http://127.0.0.1:8000/api/services"
        );
        if (!serviceResponse.ok) throw new Error("Failed to fetch services");

        const servicesData = await serviceResponse.json();
        setServices(servicesData);

        const seatsResponse = await fetch(
          `http://127.0.0.1:8000/api/available?date=${today}`
        );
        if (!seatsResponse.ok)
          throw new Error("Failed to fetch available seats");

        const seatsData = await seatsResponse.json();
        const availableSeatsMap = seatsData.reduce((acc, item) => {
          acc[item.service_id] = item.available_seats;
          return acc;
        }, {});

        setAvailableSeats(availableSeatsMap);
        console.log(availableSeats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [date]);

  // Handle preselected service
  useEffect(() => {
    if (preselectedServiceId) {
      const serviceToSelect = services.find(
        (service) => service.id === Number(preselectedServiceId)
      );
      if (serviceToSelect) {
        setSelectedService(serviceToSelect);
        onServiceSelect?.(serviceToSelect);
      }
    }
  }, [services, preselectedServiceId, onServiceSelect]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  };

  const handleBookClick = (serviceId) => {
    navigate(`/booking?serviceId=${serviceId}`);
  };

  const renderServiceCard = (service) => (
    <div className="cards col-lg-4 col-md-6 col-sm-12 mb-4" key={service.id}>
      <Tooltip
        title={
          availableSeats[service.id]
            ? `Available Seats: ${availableSeats[service.id] || 0}`
            : "This is unavailable."
        }
        style={{ backgroundColor: "rgb(0, 255, 30)", color: "#222" }}
        followCursor
      >
        <div
          className={`card ${
            isBookingPage && selectedService?.id === service.id
              ? "selected"
              : ""
          }`}
          style={{ width: "17rem", height: "24rem" }}
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
                    checked={selectedService?.id === service.id}
                  />
                  <label
                    className={`btn ${
                      availableSeats[service.id] === 0
                        ? "btn-primary-clr"
                        : "btn-secondary-clr"
                    }`}
                    htmlFor={`service${service.id}`}
                  >
                    {selectedService?.id === service.id
                      ? "Selected"
                      : availableSeats[service.id] === 0
                      ? "Selected"
                      : "Select"}
                  </label>
                </>
              ) : (
                <button
                  onClick={() => handleBookClick(service.id)}
                  className={`btn btn-primary-clr ${
                    availableSeats[service.id] === 0 ? "disabled" : ""
                  }`}
                >
                  {availableSeats[service.id] === 0 ? "Unavailable" : "Book"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );

  return (
    <section className="container items" id="services">
      <h1 className="fs-700 ff-serif text-center">{title}</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row flex-items">
          {!isBookingPage && <Promo />}
          {services.slice(0, show).map(renderServiceCard)}
        </div>
      )}
    </section>
  );
};

export default Service;
