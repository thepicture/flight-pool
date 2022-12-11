import Head from "next/head";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PassengerList from "../../components/PassengerList/PassengerList";
import ReservationFlightList from "../../components/ReservationFlightList/ReservationFlightList";
import { ReservationFooter } from "../../components/ReservationFooter/ReservationFooter";

const ReservationPage = () => {
  return (
    <div>
      <Head>
        <title>Flight Pool - Reservation</title>
        <meta name="description" content="Reserve a Flight" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <ReservationFlightList />
        <PassengerList canAddPassenger canExclude />
        <ReservationFooter />
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;
