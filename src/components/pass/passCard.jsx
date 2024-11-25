import React from 'react';
import { Check } from 'lucide-react';

const AnimatedBullet = ({ number, isUsed, className }) => {
  return (
    <div 
      className={`bullet ${isUsed ? 'used' : ''} ${className || ''}`}
    >
      <div className="number">{number}</div>
      <div className="checkmark">
        <Check color="white" size={14} />
      </div>
    </div>
  );
};

const PassCard = ({ customerDetails, passDetails, logo }) => {
  // Calculate used bullets based on remaining bullets
  const totalBullets = 15;
  // If remaining_bullets is undefined, assume all bullets are unused
  const remainingBullets = passDetails?.remaining_bullets ?? totalBullets;
  
  // A bullet is used only if its number is less than or equal to the remaining bullets
  const isUsed = (bulletNumber) => {
    const usedBullets = totalBullets - remainingBullets;
    return bulletNumber <= usedBullets; // A bullet is used if its number is <= used bullets
  };

  return (
    <div className="pass">
      <div className="header d-flex">
        <div>
          <img src={logo} height="40px" alt="Logo" />
        </div>
        <div>Studeo Spaces</div>
      </div>
      <div className="body">
        <div className="center d-flex">
          <div className="bullets-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <AnimatedBullet 
                key={`left-${num}`} 
                number={num} 
                isUsed={isUsed(num)}
              />
            ))}
          </div>
          <div className="user-id text-center">
            <div className="id-picture"></div>
            <div className="name title">Name</div>
            <div className="name sub-title">
              {customerDetails?.name || "N/A"}
            </div>
            <div className="id title">ID No.</div>
            <div className="id sub-title">
              {customerDetails?.id || "N/A"}
            </div>
            <div className="contactNo title">Contact No.</div>
            <div className="contactNo sub-title">
              {customerDetails?.contact_number || "N/A"}
            </div>
          </div>
          <div className="bullets-1">
            {[15, 14, 13, 12, 11].map((num) => (
              <AnimatedBullet 
                key={`right-${num}`} 
                number={num} 
                isUsed={isUsed(num)}
              />
            ))}
          </div>
        </div>
        <div className="bottom bullets-2 d-flex justify-content-between">
          {[6, 7, 8, 9, 10].map((num) => (
            <AnimatedBullet 
              key={`bottom-${num}`} 
              number={num} 
              isUsed={isUsed(num)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassCard;