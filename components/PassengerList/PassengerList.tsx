import React from "react";
import Passenger from "./Passenger/Passenger";

import styles from "styles/PassengerList/PassengerList.module.css";

interface PassengerListProps {
  canAddPassenger?: boolean;
  canExclude?: boolean;
}

const PassengerList: React.FC<PassengerListProps> = ({
  canAddPassenger,
  canExclude,
}) => {
  const passengers = [];
  for (let i = 0; i < 4; i++) {
    passengers.push(
      <Passenger
        firstName="John"
        lastName="Doe"
        dateOfBirth={new Date(10000000)}
        documentNumber={i * 100000}
        canExclude={canExclude}
      />
    );
  }

  return (
    <>
      <section className={styles.container}>
        <section className={styles.header}>
          <h2>Passengers</h2>
          {canAddPassenger && (
            <input
              type="button"
              value="Add a Passenger"
              className="test-5-add"
            />
          )}
        </section>
        {passengers}
      </section>
    </>
  );
};

export default PassengerList;
