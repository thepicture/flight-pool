import Head from "next/head";

import { FlightList } from "../../components/FlightList/FlightList";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const FlightPage = () => {
  return (
    <div>
      <Head>
        <title>Flight Pool - Flights</title>
        <meta name="description" content="Search results for Flights" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <FlightList />
      </main>
      <Footer />
    </div>
  );
};

export default FlightPage;
