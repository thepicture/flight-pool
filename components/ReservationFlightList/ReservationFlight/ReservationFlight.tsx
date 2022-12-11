import React from "react";

import Image from "next/image";

import styles from "styles/ReservationFlightList/ReservationFlight/ReservationFlight.module.css";

interface ReservationFlightProps {
  number: number;
  departureCity: string;
  departureAirportName: string;
  departureDate: Date;
  arrivalCity: string;
  arrivalAirportName: string;
  arrivalDate: Date;
  priceInRubles: number;
}

const ReservationFlight: React.FC<ReservationFlightProps> = ({
  number,
  departureCity,
  departureAirportName,
  departureDate,
  arrivalCity,
  arrivalAirportName,
  arrivalDate,
  priceInRubles,
}) => {
  return (
    <section className={styles.article}>
      <Image
        src="/promotion1.jpg"
        alt="Test Flight"
        width={200}
        height={200}
        style={{ width: "100%", objectFit: "cover" }}
        className="test-0-ai"
      />
      <h2 className="test-5-fc">Flight №{number}</h2>
      <p className="test-5-fcity">Departure city: {departureCity}</p>
      <p className="test-5-from">Departure Airport: {departureAirportName}</p>
      <p className="test-5-dd">
        Departure date is {departureDate.toDateString()}
      </p>
      <p className="test-5-dt">
        Departure time is {departureDate.toLocaleTimeString()}
      </p>
      <p className="test-5-tcity">Arrival city: {arrivalCity}</p>
      <p className="test-5-to">Arrival Airport: {arrivalAirportName}</p>
      <p className="test-5-at">
        Arrival time is {arrivalDate.toLocaleTimeString()}
      </p>
      <p className="test-5-fp">
        Price: <strong>{priceInRubles} RUB</strong>
      </p>
    </section>
  );
};

export default ReservationFlight;
