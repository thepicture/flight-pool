import Head from "next/head";

import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import PassengerList from "../../../components/PassengerList/PassengerList";
import ReservationFlightList from "../../../components/ReservationFlightList/ReservationFlightList";
import { ReservationFooter } from "../../../components/ReservationFooter/ReservationFooter";
import { ReservationManagementFooter } from "../../../components/ReservationManagementFooter/ReservationManagementFooter";
import ReservationManagementHeader from "../../../components/ReservationManagementHeader/ReservationManagementHeader";

const ReservationManagementPage = () => {
  return (
    <div>
      <Head>
        <title>Flight Pool - Reservation Management</title>
        <meta name="description" content="Manage the existing Reservation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <ReservationManagementHeader
          reservationCode={100}
          priceInRubles={10000}
        />
        <ReservationFlightList />
        <PassengerList />
        <ReservationManagementFooter />
      </main>
      <Footer />
    </div>
  );
};

export default ReservationManagementPage;
