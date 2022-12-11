import React from "react";

import styles from "styles/ReservationFooter/ReservationFooter.module.css";

export const ReservationFooter = () => {
  return (
    <section className={styles.container}>
      <p className="test-5-price">
        Final price: <strong>{20000} RUB</strong>
      </p>
      <input type="button" value="Book!" className="test-5-book" />
    </section>
  );
};
