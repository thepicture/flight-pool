import React from "react";
import SiteNavigation from "./SiteNavigation/SiteNavigation";

import styles from "styles/Footer/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <SiteNavigation />
    </footer>
  );
};

export default Footer;
