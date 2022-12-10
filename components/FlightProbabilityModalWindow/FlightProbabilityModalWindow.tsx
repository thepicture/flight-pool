import React, { useEffect, useRef } from "react";

import styles from "styles/FlightProbabilityModalWindow/FlightProbabilityModalWindow.module.css";

interface FlightProbabilityModalWindowProps {
  date: string;
  reservationCount: number;
  isVisible: boolean;
  onClose: () => void;
}

const FlightProbabilityModalWindow: React.FC<
  FlightProbabilityModalWindowProps
> = ({ date, reservationCount, isVisible, onClose }) => {
  const modalRef = useRef<HTMLElement>(null);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isVisible && modalRef.current) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isVisible]);

  const getFlightProbability = () =>
    100 -
    8 / reservationCount -
    (+new Date(date) - +new Date()) / 1000 / 24 / 60 / 60;

  const getCostChange = () => 200 - 10 * reservationCount;

  const costChange = `$${getCostChange()}`;
  const flightProbability = `${getFlightProbability().toFixed(0)}%`;

  return (
    <>
      <div className={styles.shadow} aria-hidden={true} hidden={!isVisible} />
      <section className={styles.section} hidden={!isVisible} ref={modalRef}>
        <h2>Cost Change and Flight Probability Result</h2>
        <p>
          Cost change: <strong>{costChange}</strong>
        </p>
        <p>
          Flight Probability: <strong>{flightProbability}</strong>
        </p>
        <input
          type="button"
          autoFocus={true}
          value="Got It"
          onClick={handleClose}
          className={styles.gotItButton}
        />
      </section>
    </>
  );
};

export default FlightProbabilityModalWindow;
