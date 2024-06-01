import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookingSummary = () => {
    navigate("/booking-summary", { state: location.state });
  };

  return (
    <button className="btn btn-primary-clr" onClick={handleBookingSummary}>
      BUTTON LANG PARA MAKITA ANG FLOW
    </button>
  );
};

export default Payment;
