import React, { useState } from "react";

import styles from "styles/ReservationCommons/ReservationCommons.module.css";

const ReservationCommons = () => {
  const [isReservationCountHidden, setIsReservationCountHidden] =
    useState(true);
  const [isShowExampleButtonHidden, setIsShowExampleButtonHidden] =
    useState(true);

  const onDateChange = () => {
    setIsReservationCountHidden(false);
  };

  const onReservationCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.checkValidity() || !event.target.value) {
      return;
    }
    setIsShowExampleButtonHidden(false);
  };

  return (
    <form action="post" className={styles.form}>
      <h2>Reservation Commons</h2>
      <label>
        Select Date
        <input type="date" onChange={onDateChange} />
      </label>
      <div hidden={isReservationCountHidden}>
        <label>
          Reservation Count
          <input
            type="text"
            pattern="[1-8]{1}"
            placeholder="2"
            onChange={onReservationCountChange}
          />
        </label>
      </div>
      <input
        type="submit"
        value="Show Example"
        hidden={isShowExampleButtonHidden}
      />
    </form>
  );
};

export default ReservationCommons;
