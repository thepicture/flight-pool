import React from "react";

import styles from "styles/DiscountList/DiscountList.module.css";
import DiscountItem from "./DiscountItem/DiscountItem";

const DiscountList = () => {
  return (
    <article className={styles.container}>
      <h2 className={styles.header}>Discounts</h2>
      <DiscountItem
        headLine="Returning and Changing Your Tickets"
        description="The pandemic has changed many travelers’ plans, but we know that it will not last forever. 
Once all of this is over, we will continue exploring this world the way we used to. 
Special rules that have been developed for this challenging situation will help you cancel your trip
or postpone it until later."
        imagePath="/promotion1.jpg"
      />
      <DiscountItem
        headLine="Best offers"
        description="To see again the streets that witnessed so much. To hug your beloved ones and look back to see
what you’ve come through. And to think of new dreams that will be so special!"
        imagePath="/promotion2.jpg"
      />
      <DiscountItem
        headLine="See you more often"
        description="Since the beginning of January, we have been expanding the geography of flights in Russia so that you can
see your loved ones more often. Choose our company to fly to where you are always expected."
        imagePath="/promotion3.jpg"
      />
      <DiscountItem
        headLine="Everything is on again"
        description="From August 10, we will resume flights to Turkey. Flights from Moscow to Antalya will be operated twice
a day daily, and flights on the Moscow-Dalaman route will be operated three to seven times a week."
        imagePath="/promotion4.jpg"
      />
    </article>
  );
};

export default DiscountList;
