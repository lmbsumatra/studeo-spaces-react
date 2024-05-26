import { useNavigate } from "react-router-dom";
const Payment = () => {
  // anong payment gateway ba gagamitin
  // example lang to para sa flow
  const navigate = useNavigate();
  const handleBookingSummary = () => {
    
    navigate("/booking-successful");
  };

  return (
    <button className="btn btn-primary-clr" onClick={handleBookingSummary}>
      BUTTON LANG PARA MAKITA ANG FLOW
    </button>
  );
};

export default Payment;
