import React from "react";
import CompanyLogo from "./CompanyLogo/CompanyLogo";
import NavigationMenu from "./NavigationMenu/NavigationMenu";

import styles from "styles/Header/Header.module.css";

const Header = () => {
  return (
    <header className={styles.container}>
      <CompanyLogo />
      <NavigationMenu />
    </header>
  );
};

export default Header;
