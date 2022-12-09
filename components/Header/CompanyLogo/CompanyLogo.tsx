import Image from "next/image";
import React from "react";

import styles from "styles/Header/CompanyLogo/CompanyLogo.module.css";

const CompanyLogo = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/logo.png"
        alt="Company logo"
        fill={true}
        className="test-0-logo"
      />
    </div>
  );
};

export default CompanyLogo;
