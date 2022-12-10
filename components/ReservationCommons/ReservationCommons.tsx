import React, { useState } from "react";

import styles from "styles/ReservationCommons/ReservationCommons.module.css";
import { useFormattedDate } from "../../hooks/useFormattedTodayDate";
import FlightProbabilityModalWindow from "../FlightProbabilityModalWindow/FlightProbabilityModalWindow";

const ReservationCommons = () => {
  const [isReservationCountVisible, setIsReservationCountVisible] =
    useState(false);
  const [isShowExampleButtonVisible, setIsShowExampleButtonVisible] =
    useState(false);

  const [date, setDate] = useState("");
  const [reservationCount, setReservationCount] = useState(0);

  const [formattedDate] = useFormattedDate();

  const [isResultVisible, setIsResultVisible] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);

    setIsReservationCountVisible(true);
  };

  const handleReservationCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.checkValidity() || !event.target.value) {
      return;
    }

    setReservationCount(event.target.value);

    setIsShowExampleButtonVisible(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsResultVisible(true);
  };

  const handleResultClose = () => {
    setIsResultVisible(false);
  };

  return (
    <>
      <FlightProbabilityModalWindow
        date={date}
        reservationCount={reservationCount}
        isVisible={isResultVisible}
        onClose={handleResultClose}
      />
      <form action="post" onSubmit={handleSubmit} className={styles.form}>
        <h2>Reservation Commons</h2>
        <label>
          Select Date
          <input
            type="date"
            min={formattedDate}
            name="date"
            onChange={handleDateChange}
          />
        </label>
        <div style={{ opacity: +isReservationCountVisible }}>
          <label>
            Reservation Count
            <input
              type="text"
              pattern="[1-8]{1}"
              placeholder="2"
              disabled={!isReservationCountVisible}
              name="reservationCount"
              onChange={handleReservationCountChange}
            />
          </label>
        </div>
        <input
          type="submit"
          value="Show Example"
          disabled={!isShowExampleButtonVisible}
          style={{
            opacity: +isShowExampleButtonVisible,
            cursor: isShowExampleButtonVisible ? "pointer" : "default",
          }}
        />
      </form>
    </>
  );
};

export default ReservationCommons;
