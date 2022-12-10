import { useState } from "react";

export const useFormattedDate = () => {
  const [today] = useState(new Date());

  const year = today.getUTCFullYear().toString();
  const month = (today.getUTCMonth() + 1).toString();
  const day = today.getUTCDate().toString();

  const formattedTodayDate = `${year}-${"0".repeat(
    2 - month.length
  )}${month}-${"0".repeat(2 - day.length)}${day}`;

  return [formattedTodayDate];
};
