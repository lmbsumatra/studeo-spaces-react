import React, { useState } from "react";
import "./mapping_styles.css";

const MappingOverview = ({ isActive, onClose }) => {
  const [floor, setFloor] = useState("Ground Floor");

  const handleFloorChange = (event) => {
    setFloor(event.target.value);
  };

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
    "Third Floor": [
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
  };

  if (!isActive) return null;

  return (
    <div className="container-map">
      <div className="map-window">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <h3>Mapping - {floor}</h3>
        <select onChange={handleFloorChange} value={floor}>
          <option>Ground Floor</option>
          <option>Second Floor</option>
          <option>Third Floor</option>
        </select>

        <div className="seating-area">
          <div className="grid-container">
            {seatingArrangement[floor].map((seat) => (
              <div className="area seat" key={seat.id}>
                {seat.id}
              </div>
            ))}

            <div className="d-flex">
              <div className="area lobby">Lobby</div>
              <div className="area counter">Counter</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingOverview;
