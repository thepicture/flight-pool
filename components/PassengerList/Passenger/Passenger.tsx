import React from "react";

import styles from "styles/PassengerList/Passenger/Passenger.module.css";

interface PassengerProps {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  documentNumber: number;

  canExclude?: boolean;
}

const Passenger: React.FC<PassengerProps> = ({
  firstName,
  lastName,
  dateOfBirth,
  documentNumber,

  canExclude,
}) => {
  return (
    <section className={styles.article}>
      <p className="test-5-name">First Name: {firstName}</p>
      <p className="test-5-last">Last Name: {lastName}</p>
      <p className="test-5-dob">Date of Birth: {dateOfBirth.toDateString()}</p>
      <p className="test-5-doc">Document Number: {documentNumber}</p>
      {canExclude && (
        <a href="#" className="test-5-remove">
          Exclude Passenger from Flight
        </a>
      )}
    </section>
  );
};

export default Passenger;
