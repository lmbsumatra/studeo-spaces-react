import React, { useEffect, useState } from "react";
import "./mapping_styles.css";
import { Modal } from "react-bootstrap";
import { formatDate } from "../../../../utils/dateFormat";
import { baseApiUrl } from "../../../../App";

const MappingOverview = ({ isActive, onClose }) => {
  const [floor, setFloor] = useState("Ground Floor");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [servicesData, setServicesData] = useState(null);
  const [temporarySeats, setTemporarySeats] = useState([
    { id: 1, seat_code: "A1", isBooked: false },
    { id: 2, seat_code: "A2", isBooked: true },
    { id: 3, seat_code: "A3", isBooked: false },
    { id: 4, seat_code: "A4", isBooked: true },
    { id: 5, seat_code: "A5", isBooked: false },
    { id: 6, seat_code: "A6", isBooked: true },
    { id: 7, seat_code: "A7", isBooked: false },
    { id: 8, seat_code: "A8", isBooked: true },
    { id: 9, seat_code: "A9", isBooked: false },
    { id: 10, seat_code: "A10", isBooked: true },
  ]);

  const handleFloorChange = (event) => {
    setFloor(event.target.value);
  };

  const fetchSeatData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}booking-data`);
      const data = await response.json();
      console.log("Data from API:", data);

      // Check if the response is an array, and set it as the services data
      if (Array.isArray(data)) {
        setServicesData(data); // Set the services array
      } else {
        console.error("Expected an array, but received:", data);
      }
    } catch (error) {
      console.error("Error fetching seat data:", error);
    }
  };

  useEffect(() => {
    if (currentDate) {
      fetchSeatData();
    }
  }, [currentDate]);

  // Update the date and time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString());
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isActive) return null;

  if (!servicesData) {
    return (
      <div className="container-map">
        <div className="map-window">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div>Loading data...</div>
        </div>
      </div>
    );
  }

  // Find the Glassbox service (service_id 3)
  const glassboxService = servicesData.find(
    (service) => service.service_id === 3
  );
  const allDayAllNightService = servicesData.find(
    (service) => service.service_id === 1
  );
  const secondFloorRoom1 = servicesData.find(
    (service) => service.service_id === 5
  );
  const secondFloorRoom2 = servicesData.find(
    (service) => service.service_id === 6
  );

  if (!glassboxService) {
    return (
      <div className="container-map">
        <div className="map-window">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div>No service found with service_id 3.</div>
        </div>
      </div>
    );
  }

  let serviceContent = null;
  if (glassboxService && floor === "Ground Floor") {
    serviceContent = (
      <div className="px-2">
        <div className="card p-4">
          <h3 className="ff-serif">{`${glassboxService.service_name}`}</h3>
          <p>{`${glassboxService.duration}`}</p>
          <p>Availability Summary</p>
          <div className="d-flex">
            <div className="d-block w-100 py-2">
              <div className="card p-2">
                Available Seats{" "}
                <span className="fw-bold">
                  {glassboxService.availableSeats}
                </span>
              </div>
              <div className="card p-2">
                Booked Seats{" "}
                <span className="fw-bold">{glassboxService.bookedSeats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (
    allDayAllNightService &&
    secondFloorRoom1 &&
    secondFloorRoom2 &&
    floor === "Second Floor"
  ) {
    serviceContent = (
      <div className="scrollable p-3">
        <div className="card p-3">
          <h5 className="ff-serif">{`${allDayAllNightService.service_name}`}</h5>
          <p>{`${allDayAllNightService.duration}`}</p>
          <p>Availability Summary</p>
          <div className="d-flex">
            <div className="d-block w-100 py-2">
              <div className="card p-2">
                Available Seats{" "}
                <span className="fw-bold">
                  {allDayAllNightService.availableSeats}
                </span>
              </div>
              <div className="card p-2">
                Booked Seats{" "}
                <span className="fw-bold">
                  {allDayAllNightService.bookedSeats}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card p-3">
          <h5 className="ff-serif">{`${secondFloorRoom1.service_name}`}</h5>
          <p>{`${secondFloorRoom1.duration}`}</p>
          <p>Availability Summary</p>
          <div className="d-flex">
            <div className="d-block w-100 py-2">
              <div className="card px-2">
                Available Seats{" "}
                <span className="fw-bold">
                {secondFloorRoom1?.seats?.[0]?.isBooked ? "Booked" : "Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card p-3">
          <h5 className="ff-serif">{`${secondFloorRoom2.service_name}`}</h5>
          <p>{`${secondFloorRoom2.duration}`}</p>
          <p>Availability Summary</p>
          <div className="d-flex">
            <div className="d-block w-100 py-2">
              <div className="card p-2">
                Available Seats{" "}
                <span className="fw-bold">
                  {secondFloorRoom2?.seats?.[0]?.isBooked ? "Booked" : "Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groundFloorSeats = glassboxService.seats || [];
  const secondFloorSeats = allDayAllNightService.seats || [];
  const secondFloorRooms = [
    ...(secondFloorRoom1.seats || []),
    ...(secondFloorRoom2.seats || []),
  ];


  return (
    <Modal show={isActive} onHide={onClose} size={floor === "Ground Floor" ? "lg" : "xl"} centered  dialogClassName="my-modal">
      <Modal.Header closeButton>
        <Modal.Title>Mapping Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="map-window ">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div className="d-flex justify-content-between align-items-center py-2">
            <h3>
              Mapping -{" "}
              <select onChange={handleFloorChange} value={floor}>
                <option>Ground Floor</option>
                <option>Second Floor</option>
                <option>Third Floor</option>
              </select>
            </h3>
            <p>
              {formatDate(currentDate)} {currentTime}
            </p>
          </div>

          {/* Ground Floor Layout */}
          {floor === "Ground Floor" && (
            <div className="map-view">
              <div className="area d-block">
                <div className="seat-container">
                  <div className="seats-left">
                    {groundFloorSeats.slice(0, 5).map((seat) => (
                      <div
                        className={`seat ${
                          seat.isBooked ? "booked" : "available"
                        }`}
                        key={seat.id}
                      >
                        {seat.seat_code}
                      </div>
                    ))}
                  </div>

                  <div className="seats-right">
                    {groundFloorSeats.slice(5, 10).map((seat) => (
                      <div
                        className={`seat ${
                          seat.isBooked ? "booked" : "available"
                        }`}
                        key={seat.id}
                      >
                        {seat.seat_code}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="stairs">
                  <span>Stairs</span>
                </div>
                <div className="bottom-area">
                  <div className="lobby">
                    <span>Lobby</span>
                  </div>
                  <div className="counter">
                    <span>Counter</span>
                  </div>
                </div>
              </div>
              {serviceContent}
            </div>
          )}

          {/* Second Floor Layout */}
          {floor === "Second Floor" && (
            <div className="map-view" style={{ width: "auto" }}>
              <div className="area">
                {/* Pantry area */}
                <div className="bottom-area">
                  <div className="lobby lobby-3">
                    <span>Pantry</span>
                  </div>

                  {/* BarkadAral 01 */}
                  <div
                   className={`card p-2 ${
                    secondFloorRoom1?.seats?.[0]?.isBooked ? "roombooked" : "roomavailable"
                  }`}
                  >
                    <span>BarkadAral 01</span>
                    <div className="seat-container b-2">
                      <div>
                        {temporarySeats.slice(0, 4).map((seat) => (
                          <div className="seat text-dark" key={seat.id}>
                            {seat.seat_code}
                            <div className="chair"></div>
                          </div>
                        ))}
                      </div>
                      <div>
                        {temporarySeats.slice(4, 8).map((seat) => (
                          <div className="seat text-dark">
                            {seat.seat_code}
                            <div className="chair"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* BarkadAral 02 */}
                  <div
                    className={`card p-2 ${
                      secondFloorRoom2?.seats?.[0]?.isBooked ? "roombooked" : "roomavailable"
                    }`}
                  >
                   <span>BarkadAral 02 </span>

                    <div className="seat-container b-2">
                      <div>
                        {temporarySeats.slice(0, 4).map((seat) => (
                          <div className="seat text-dark" key={seat.id}>
                            {seat.seat_code}
                            <div className="chair"></div>
                          </div>
                        ))}
                      </div>
                      <div>
                        {temporarySeats.slice(4, 8).map((seat) => (
                          <div className="seat text-dark">
                            {seat.seat_code}
                            <div className="chair"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stairs */}
                  <div className="lobby lobby-3">
                    <span>Stairs</span>
                  </div>
                </div>

                {/* Middle Area */}
                <div className="middle-area d-flex">
                  <div className="d-block">
                    <div className="middle-left-top">
                      {secondFloorSeats.slice(0, 4).map((seat) => (
                        <div
                          className={`seat ${
                            seat.isBooked ? "booked" : "available"
                          }`}
                          key={seat.id}
                        >
                          {seat.seat_code}
                          <div className="chair"></div>
                        </div>
                      ))}
                    </div>
                    <div className="middle-left-bottom">
                      {secondFloorSeats.slice(4, 8).map((seat) => (
                        <div
                          className={`seat ${
                            seat.isBooked ? "booked" : "available"
                          }`}
                          key={seat.id}
                        >
                          {seat.seat_code}
                          <div className="chair"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="middle-left-top">
                      {secondFloorSeats.slice(8, 11).map((seat) => (
                        <div
                          className={`seat ${
                            seat.isBooked ? "booked" : "available"
                          }`}
                          key={seat.id}
                        >
                          {seat.seat_code}
                          <div className="chair"></div>
                        </div>
                      ))}
                    </div>
                    <div className="middle-left-bottom">
                      {secondFloorSeats.slice(11, 14).map((seat) => (
                        <div
                          className={`seat ${
                            seat.isBooked ? "booked" : "available"
                          }`}
                          key={seat.id}
                        >
                          {seat.seat_code}
                          <div className="chair"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lobby2">
                    <span>Counter 2</span>
                  </div>
                </div>
                <div className="middle-area d-flex">
                  <div className="middle-left-bottom">
                    {secondFloorSeats.slice(14, 27).map((seat) => (
                      <div
                        className={`seat ${
                          seat.isBooked ? "booked" : "available"
                        }`}
                        key={seat.id}
                      >
                        {seat.seat_code}
                        <div className="chair"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {serviceContent}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MappingOverview;
