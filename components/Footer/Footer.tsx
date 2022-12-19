import React from "react";
import SiteNavigation from "./SiteNavigation/SiteNavigation";

import styles from "styles/Footer/Footer.module.css";

interface FooterProps {
  sticky?: boolean;
}

const Footer: React.FC<FooterProps> = ({ sticky = false }) => {
  return (
    <footer className={`${styles.footer} ${sticky ? styles.sticky : ""}`}>
      <SiteNavigation />
    </footer>
  );
};

export default Footer;
