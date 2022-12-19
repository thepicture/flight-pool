import React from "react";
import Seat from "./Seat/Seat";

import styles from "../../styles/SeatList/SeatList.module.css";

interface SeatListProps {
  seats: { id: number; isChosen: boolean }[];
  onSeatToggle: (id: number) => void;
}

const SeatList: React.FC<SeatListProps> = ({ seats, onSeatToggle }) => {
  const seatMarkup = seats.map((seat) => (
    <Seat
      key={seat.id}
      id={seat.id}
      isChosen={seat.isChosen}
      onSeatToggle={onSeatToggle}
    />
  ));

  return (
    <>
      <h2 className={styles.heading}>Select seats in aircraft</h2>
      <section className={styles.container}>{seatMarkup}</section>
    </>
  );
};

export default SeatList;
