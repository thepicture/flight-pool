import React from "react";

import Image from "next/image";

import styles from "styles/FlightList/Flight/Flight.module.css";

interface FlightProps {
  number?: number;
  aircraft?: string;
  departureCityName?: string;
  arrivalCityName?: string;
  departureAirportName?: string;
  departureDate?: Date;
  arrivalDate?: Date;
  arrivalAirportName?: string;
  priceInRubles?: number;
  flightProbability?: number;
}

const Flight: React.FC<FlightProps> = ({
  number,
  aircraft,
  departureCityName,
  arrivalCityName,
  departureAirportName,
  departureDate,
  arrivalDate,
  arrivalAirportName,
  priceInRubles,
  flightProbability,
}) => {
  return (
    <section className={styles.article}>
      <Image
        src="/promotion1.jpg"
        alt="Test Flight"
        width={200}
        height={200}
        style={{ width: "100%", objectFit: "cover" }}
      />
      {number && <h2>Flight №{number}</h2>}
      {aircraft && <p>Aircraft: {aircraft}</p>}
      {departureCityName && <p>Departure city: {departureCityName}</p>}
      {arrivalCityName && <p>Arrival city: {arrivalCityName}</p>}
      {departureAirportName && <p>Departure Airport: {departureAirportName}</p>}
      {arrivalAirportName && <p>Arrival Airport: {arrivalAirportName}</p>}
      {departureDate && <p>Departure on {departureDate.toDateString()}</p>}
      {departureDate && (
        <p>Departure time is {departureDate.toLocaleTimeString()}</p>
      )}
      {arrivalDate && <p>Arrive time is {arrivalDate.toLocaleTimeString()}</p>}
      {arrivalDate && departureDate && (
        <p>
          Time in Flight:{" "}
          {Math.floor((+arrivalDate - +departureDate) / 60 / 1000)} minutes
        </p>
      )}
      <p>Price: {priceInRubles} RUB</p>
      {flightProbability && (
        <p>
          Flight Probability: <strong>{flightProbability * 100}%</strong>
        </p>
      )}
      <section className={styles.action}>
        <a href="#">Use to departure</a>
        <a href="#">Use to return back</a>
      </section>
    </section>
  );
};

export default Flight;
