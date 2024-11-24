import React, { useEffect, useState } from "react";
import "./mapping_styles.css";
import { Modal } from "react-bootstrap";
import { formatDate } from "../../../../utils/dateFormat";
import { baseApiUrl } from "../../../../App";

const MappingOverview = ({ isActive, onClose }) => {
  const [floor, setFloor] = useState("Ground Floor");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [servicesData, setServicesData] = useState([]);

  const handleFloorChange = (event) => {
    setFloor(event.target.value);
  };

  const fetchSeatData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}booking-data`);
      const data = await response.json();
      console.log("Data from API:", data);
      setServicesData(data); // Set per-service data
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
      setCurrentDate(now.toLocaleDateString()); // Get current date in format: MM/DD/YYYY
      setCurrentTime(now.toLocaleTimeString()); // Get current time in format: HH:mm:ss AM/PM
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Define seating arrangements for each floor
  const seatingArrangement = {
    "Ground Floor": [
      { id: "GBD01" },
      { id: "GBD02" },
      { id: "GBD03" },
      { id: "GBD04" },
      { id: "GBD05" },
      { id: "GBD06" },
      { id: "GBD07" },
      { id: "GBD08" },
      { id: "GBD09" },
      { id: "GBD10" },
    ],
    "Second Floor": [
      { id: "BAR01" },
      { id: "BAR02" },
      { id: "BAR03" },
      { id: "BAR04" },
      { id: "BAR05" },
      { id: "BAR06" },
      { id: "BAR07" },
      { id: "BAR08" },
      { id: "BART1" },
      { id: "BART2" },
      { id: "BART3" },
      { id: "BART4" },
      { id: "BART5" },
      { id: "BART6" },
      { id: "BART7" },
      { id: "BART8" },
      { id: "ADAN1" },
      { id: "ADAN2" },
      { id: "ADAN3" },
      { id: "ADAN4" },
      { id: "ADAN5" },
      { id: "ADAN6" },
      { id: "ADAN7" },
      { id: "ADAN8" },
      { id: "ADAN9" },
      { id: "ADAN10" },
      { id: "ADAN11" },
      { id: "ADAN12" },
      { id: "ADAN13" },
      { id: "ADAN14" },
      { id: "ADAN15" },
      { id: "ADAN16" },
      { id: "ADAN17" },
      { id: "ADAN18" },
      { id: "ADAN19" },
      { id: "ADAN20" },
      { id: "ADAN21" },
      { id: "ADAN22" },
      { id: "ADAN23" },
      { id: "ADAN24" },
      { id: "ADAN25" },
      { id: "ADAN26" },
      { id: "ADAN27" },
      { id: "ADAN28" },
      { id: "ADAN29" },
      { id: "ADAN30" },
      { id: "ADAN31" },
      { id: "ADAN32" },
      { id: "ADAN33" },
      { id: "ADAN34" },
      { id: "ADAN35" },
    ],
  };

  if (!isActive) return null;

  const glassboxService = servicesData.find(
    (service) => service.service_id === 2
  );
  let serviceContent = null;
  if (glassboxService) {
    serviceContent = (
      <div className="p-2">
        <p>{`${glassboxService.service_name}`}</p>
        <p>{`${glassboxService.duration}`}</p>
        <p>Available Seats</p>
        <div className="d-flex">
          <div className="d-block p-2">
            <div className="card p-2">
              Available Seats{" "}
              <span className="fw-bold">{glassboxService.availableSeats}</span>
            </div>
            <div className="card p-2">
              Booked Seats{" "}
              <span className="fw-bold">{glassboxService.bookedSeats}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-map">
        <div className="map-window">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              Mapping -{" "}
              <select onChange={handleFloorChange} value={floor}>
                <option>Ground Floor</option>
                <option>Second Floor</option>
                <option>Third Floor</option>
              </select>
            </h3>{" "}
            <p>
              {formatDate(currentDate)} {currentTime}
            </p>
          </div>
          {floor === "Ground Floor" && (
            <div className="d-flex m-2">
              <div className="area d-block">
                <div className="seat-container">
                  <div className="seats-left">
                    {seatingArrangement["Ground Floor"]
                      .slice(0, 5)
                      .map((seat) => (
                        <div className="seat" key={seat.id}>
                          {seat.id}
                          <div className="chair"></div>
                        </div>
                      ))}
                  </div>

                  <div className="seats-right">
                    {seatingArrangement[floor].slice(5, 10).map((seat) => (
                      <div className="seat" key={seat.id}>
                        {seat.id}
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

          {floor === "Second Floor" && (
            <div style={{ width: "auto" }}>
              <div className="area">
                <div className="bottom-area">
                  <div className="lobby">
                    <span>Pantry</span>
                  </div>
                  <div className="">
                    <span>BarkadAral 01</span>
                    <div className="seat-container b-1">
                      <div className="">
                        {seatingArrangement["Second Floor"]
                          .slice(0, 4)
                          .map((seat) => (
                            <div className="seat" key={seat.id}>
                              {seat.id}
                              <div className="chair"></div>
                            </div>
                          ))}
                      </div>
                      <div className="">
                        {seatingArrangement["Second Floor"]
                          .slice(4, 8)
                          .map((seat) => (
                            <div className="seat" key={seat.id}>
                              {seat.id}
                              <div className="chair"></div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <span>BarkadAral 02</span>
                    <div className="seat-container b-2">
                      <div className="">
                        {seatingArrangement["Second Floor"]
                          .slice(8, 12)
                          .map((seat) => (
                            <div className="seat" key={seat.id}>
                              {seat.id}
                              <div className="chair"></div>
                            </div>
                          ))}
                      </div>
                      <div className="">
                        {seatingArrangement["Second Floor"]
                          .slice(12, 16)
                          .map((seat) => (
                            <div className="seat" key={seat.id}>
                              {seat.id}
                              <div className="chair"></div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="lobby">
                    <span>Stairs</span>
                  </div>
                </div>
                <div className="middle-area d-flex">
                  <div className="d-block">
                    <div className="middle-left-top">
                      {seatingArrangement["Second Floor"]
                        .slice(16, 20)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                    <div className="middle-left-bottom">
                      {seatingArrangement["Second Floor"]
                        .slice(20, 24)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="middle-left-top">
                      {seatingArrangement["Second Floor"]
                        .slice(24, 27)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                    <div className="middle-left-bottom">
                      {seatingArrangement["Second Floor"]
                        .slice(27, 30)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="lobby2">
                    <span>Counter 2</span>
                  </div>
                </div>
                <div className="middle-area-2 d-flex">
                  <div className="d-block">
                    <div className="middle-left-bottom">
                      {seatingArrangement["Second Floor"]
                        .slice(30, 35)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="middle-left-bottom">
                      {seatingArrangement["Second Floor"]
                        .slice(35, 39)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {/* <div className="middle-area-3 d-flex">
                  <div className="d-block">
                    <div className="middle-left-bottom">
                      {seatingArrangement["Second Floor"]
                        .slice(39, 51)
                        .map((seat) => (
                          <div className="seat" key={seat.id}>
                            {seat.id}
                            <div className="chair"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MappingOverview;
