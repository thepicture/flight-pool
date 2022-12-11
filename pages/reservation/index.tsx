import Head from "next/head";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PassengerList from "../../components/PassengerList/PassengerList";
import ReservationFlightList from "../../components/ReservationFlightList/ReservationFlightList";

import styles from "styles/ReservationPage/ReservationPage.module.css";

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
        <PassengerList />
        <section className={styles.container}>
          <p className="test-5-price">
            Final price: <strong>{20000} RUB</strong>
          </p>
          <input type="button" value="Book!" className="test-5-book" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;
