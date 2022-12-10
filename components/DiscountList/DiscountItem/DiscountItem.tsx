import React from "react";

import Image from "next/image";

import styles from "styles/DiscountList/DiscountItem/DiscountItem.module.css";

interface DiscountItemProps {
  headLine: string;
  description: string;
  imagePath: string;
}

const DiscountItem: React.FC<DiscountItemProps> = ({
  headLine,
  description,
  imagePath,
}) => {
  return (
    <section className={styles.article}>
      <Image
        src={imagePath}
        alt={headLine}
        width={200}
        height={200}
        style={{ width: "100%", objectFit: "cover" }}
        className="test-0-ai"
      />
      <h2 className="test-0-an">{headLine}</h2>
      <p className="test-0-ad">{description}</p>
      <a href="#" className="test-0-abm">
        Discount Info
      </a>
    </section>
  );
};

export default DiscountItem;
