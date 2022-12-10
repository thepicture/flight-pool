import React from "react";

import Image from "next/image";

import styles from "styles/FlightList/Flight/Flight.module.css";

interface FlightProps {
  number: number;
  aircraft: string;
  departureDate: Date;
  arrivalDate: Date;
  priceInRubles: number;
  flightProbability: number;
}

const Flight: React.FC<FlightProps> = ({
  number,
  aircraft,
  departureDate,
  arrivalDate,
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
        className="test-0-ai"
      />
      <h2 className="test-4-fn">Flight №{number}</h2>
      <p className="test-4-at">Aircraft: {aircraft}</p>
      <p className="test-4-dd">Departure on {departureDate.toDateString()}</p>
      <p className="test-4-dt">
        Departure time is {departureDate.toLocaleTimeString()}
      </p>
      <p className="test-4-at">
        Arrive time is {arrivalDate.toLocaleTimeString()}
      </p>
      <p className="test-0-ft">
        Time in Flight:{" "}
        {Math.floor((+arrivalDate - +departureDate) / 1000 / 60)} minutes
      </p>
      <p className="test-4-fp">{priceInRubles} RUB</p>
      <p className="test-4-fh">
        Flight Probability: <strong>{flightProbability * 100}%</strong>
      </p>
      <section className={styles.action}>
        <a href="#" className="test-0-abm">
          Use to departure
        </a>
        <a href="#" className="test-0-abm">
          Use to return back
        </a>
      </section>
    </section>
  );
};

export default Flight;
