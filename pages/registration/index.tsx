import Head from "next/head";
import { AuthForm } from "../../components/AuthForm/AuthForm";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

import styles from "../../styles/Auth/Auth.module.css";

const Registration = () => {
  return (
    <div>
      <Head>
        <title>Flight Pool - Auth</title>
        <meta name="description" content="Registration in Flight Pool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.container}>
        <AuthForm registerMode />
      </main>
      <Footer sticky />
    </div>
  );
};

export default Registration;
