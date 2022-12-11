import React from "react";

import styles from "styles/ReservationFlightList/ReservationFlightList.module.css";
import ReservationFlight from "./ReservationFlight/ReservationFlight";

const ReservationFlightList = () => {
  const flights = [];
  for (let i = 0; i < 2; i++) {
    flights.push(
      <ReservationFlight
        number={i * 1}
        departureCity="Moscow"
        departureAirportName="Sheremetyevo"
        departureDate={new Date(1000000000)}
        arrivalCity="Saint-Petersburg"
        arrivalAirportName="Pulkovo"
        arrivalDate={new Date(1000400000)}
        priceInRubles={i * 5000}
      />
    );
  }

  return (
    <>
      <section className={styles.container}>
        <h2 className={styles.header}>Reservation Flights</h2>
        {flights}
      </section>
    </>
  );
};

export default ReservationFlightList;
