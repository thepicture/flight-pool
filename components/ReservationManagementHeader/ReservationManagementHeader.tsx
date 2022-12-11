import React from "react";

interface ReservationManagementHeaderProps {
  reservationCode: number;
  priceInRubles: number;
}

const ReservationManagementHeader: React.FC<
  ReservationManagementHeaderProps
> = ({ reservationCode, priceInRubles }) => {
  return (
    <>
      <h2 className="test-6-code">Reservation №{reservationCode}</h2>
      <p className="test-6-tp">
        Price: <strong>{priceInRubles} RUB</strong>
      </p>
    </>
  );
};

export default ReservationManagementHeader;
