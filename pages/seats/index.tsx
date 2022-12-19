import Head from "next/head";
import { useState } from "react";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SeatList from "../../components/SeatList/SeatList";

const seriesPerRow = 4;
const seriesCount = 12;
const Seats = () => {
  const [seats, setSeats] = useState(
    new Array(seriesPerRow * seriesCount).fill(null).map((_, index) => {
      return {
        id: index + 1,
        isChosen: false,
      };
    })
  );

  const handleSeatToggle = (id: number) => {
    setSeats(
      seats.map((seat) => {
        if (seat.id === id) {
          seat.isChosen = !seat.isChosen;
        }

        return seat;
      })
    );
  };

  return (
    <div>
      <Head>
        <title>Flight Pool - Seats</title>
        <meta name="description" content="A main page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <SeatList seats={seats} onSeatToggle={handleSeatToggle} />
      </main>
      <Footer />
    </div>
  );
};

export default Seats;
