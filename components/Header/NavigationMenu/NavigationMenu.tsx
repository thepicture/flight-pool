import React from "react";

import styles from "styles/Header/NavigationMenu/NavigationMenu.module.css";

const NavigationMenu = () => {
  return (
    <nav>
      <ul className={styles.list}>
        <li>
          <a href="#" className={styles["test-0-nav-1"]}>
            Discounts
          </a>
        </li>
        <li>
          <a href="#" className={styles["test-0-nav-2"]}>
            Search
          </a>
        </li>
        <li>
          <a href="#" className={styles["test-0-nav-3"]}>
            Flight Registration
          </a>
        </li>
        <li>
          <a href="#" className={styles["test-0-nav-4"]}>
            My Account
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
