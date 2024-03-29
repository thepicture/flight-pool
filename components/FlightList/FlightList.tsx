import React from "react";
import Flight from "./Flight/Flight";

import styles from "styles/FlightList/FlightList.module.css";

interface FlightListProps {
  reservationMode?: boolean;
  reservationManagementMode?: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({
  reservationMode,
  reservationManagementMode,
}) => {
  const flights = [];
  for (let i = 0; i < 2 ** 5; i++) {
    if (reservationMode) {
      flights.push(
        <Flight
          number={1}
          departureCityName="Moscow"
          arrivalCityName="Saint Petersburg"
          departureAirportName="MoscowAirport"
          arrivalAirportName="StAirport"
          departureDate={new Date(1670702000000)}
          arrivalDate={new Date(1670702000000 + 1000000)}
          priceInRubles={10000}
        />
      );
    } else if (reservationManagementMode) {
      flights.push(
        <Flight
          number={1}
          aircraft="MoscowAircraft"
          departureCityName="Moscow"
          arrivalCityName="Saint Petersburg"
          departureAirportName="MoscowAirport"
          arrivalAirportName="StAirport"
          departureDate={new Date(1670702000000)}
          arrivalDate={new Date(1670702000000 + 1000000)}
          priceInRubles={10000}
          flightProbability={0.5}
        />
      );
    } else {
      flights.push(
        <Flight
          number={1}
          aircraft="Test Aircraft"
          departureDate={new Date(1670702000000)}
          arrivalDate={new Date(1670702000000 + 1000000)}
          priceInRubles={10000}
          flightProbability={0.5}
        />
      );
    }
  }

  return (
    <>
      <section className={styles.container}>
        <div>
          <h2>Flights</h2>
          <a
            href="/reservation"
            className="test-0-bsb"
            style={{
              alignSelf: "center",
              width: 200,
            }}
          >
            Start Reservation
          </a>
        </div>
        <div />
        {flights}
      </section>
    </>
  );
};
