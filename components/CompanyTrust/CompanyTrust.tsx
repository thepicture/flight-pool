import React from "react";

import styles from "styles/CompanyTrust/CompanyTrust.module.css";

const CompanyTrust = () => {
  return (
    <section className={styles.container}>
      <h2>Company Trust</h2>
      <p>
        Main goal is to <strong>evolve coherence of towns in Russia.</strong>
      </p>
      <p>
        We make towns <strong>closer</strong>, you live{" "}
        <strong>anywhere</strong> you want.
      </p>
    </section>
  );
};

export default CompanyTrust;
