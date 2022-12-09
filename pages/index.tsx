import Head from "next/head";
import ClosedDiscountsForm from "../components/ClosedDiscountsForm/ClosedDiscountsForm";
import CompanyTrust from "../components/CompanyTrust/CompanyTrust";
import DiscountList from "../components/DiscountList/DiscountList";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ReservationCommons from "../components/ReservationCommons/ReservationCommons";
import SearchForm from "../components/SearchForm/SearchForm";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Flight Pool - Main Page</title>
        <meta name="description" content="A main page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <ReservationCommons />
        <CompanyTrust />
        <SearchForm />
        <DiscountList />
        <ClosedDiscountsForm />
      </main>
      <Footer />
    </div>
  );
}
