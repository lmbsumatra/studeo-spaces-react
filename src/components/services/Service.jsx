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
  currentDate,
}) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSeats, setAvailableSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        setLoading(true);

        const [serviceResponse, seatsResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/services"),
          fetch(`http://127.0.0.1:8000/api/available?date=${today}`),
        ]);

        if (!serviceResponse.ok || !seatsResponse.ok) {
          throw new Error("Failed to fetch services or available seats");
        }

        const servicesData = await serviceResponse.json();
        const seatsData = await seatsResponse.json();

        const availableSeatsMap = seatsData.reduce(
          (acc, { service_id, available_seats }) => {
            acc[service_id] = available_seats;
            return acc;
          },
          {}
        );

        setServices(servicesData);
        setAvailableSeats(availableSeatsMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
    navigate(`/booking`, { state: serviceId });
  };

  const renderServiceCard = (service) => {
    const isAvailable = !(
      (availableSeats[service.id] > 0 && service.availability === 0) ||
      availableSeats[service.id] === 0
    );

    return (
      <div className="cards col-lg-4 col-md-6 col-sm-12 mb-4" key={service.id}>
        <Tooltip
          title={
            isAvailable
              ? `Available Seats: ${availableSeats[service.id]}`
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
                    />
                    <label
                      className={`btn ${
                        !isAvailable ? "disabled" : "btn-secondary-clr"
                      }`}
                      htmlFor={`service${service.id}`}
                    >
                      {selectedService?.id === service.id
                        ? "Selected"
                        : !isAvailable
                        ? "Unavailable"
                        : "Select"}
                    </label>
                  </>
                ) : (
                  <button
                    onClick={() => handleBookClick(service.id)}
                    className={`btn btn-primary-clr ${
                      !isAvailable ? "disabled" : ""
                    }`}
                  >
                    {" "}
                    <>{!isAvailable ? "Unavailable" : "Book"}</>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    );
  };

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
          {isBookingPage && !currentDate ? (
            <p>Please select a date to view services.</p>
          ) : (
            services.slice(0, show).map(renderServiceCard)
          )}
        </div>
      )}
    </section>
  );
};

export default Service;
