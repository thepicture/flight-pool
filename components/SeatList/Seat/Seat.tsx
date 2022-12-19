import React from "react";

import styles from "../../../styles/SeatList/Seat/Seat.module.css";

interface SeatProps {
  id: number;
  isChosen: boolean;
  onSeatToggle: (id: number) => void;
}

const Seat: React.FC<SeatProps> = ({ id, onSeatToggle, isChosen }) => {
  return (
    <button
      className={isChosen ? styles.chosen : styles.unchosen}
      onClick={() => onSeatToggle(id)}
    >
      Seat №{id}
    </button>
  );
};

export default Seat;
