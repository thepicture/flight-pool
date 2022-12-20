import Head from "next/head";
import { useState } from "react";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";

import styles from "../../styles/ProfilePage/ProfilePage.module.css";

const TEST_USER = {
  firstName: "John",
  lastName: "Doe",
  flightCount: 4,
  bookings: [
    {
      id: 1,
      departureDate: new Date(10000000000),
      arrivalDate: new Date(10000000000 + 1000000),
      departureAirportName: "DepartureAirport A",
      arrivalAirportName: "ArrivalAirport B",
    },
    {
      id: 2,
      departureDate: new Date(12000000000),
      arrivalDate: new Date(12000000000 + 1000000),
      departureAirportName: "DepartureAirport A",
      arrivalAirportName: "ArrivalAirport C",
    },
    {
      id: 3,
      departureDate: new Date(14000000000),
      arrivalDate: new Date(14000000000 + 1000000),
      departureAirportName: "DepartureAirport B",
      arrivalAirportName: "ArrivalAirport C",
    },
  ],
};

const ProfilePage = () => {
  const [user] = useState(TEST_USER);

  const handleLogout = () => {
    alert("You have logged out");
  };

  return (
    <div>
      <Head>
        <title>Flight Pool - Profile</title>
        <meta name="description" content="Manage your profile in Flight Pool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.container}>
        <Profile user={user} onLogout={handleLogout} />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
