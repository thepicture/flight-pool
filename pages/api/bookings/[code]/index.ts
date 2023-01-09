import type { NextApiRequest, NextApiResponse } from "next";

import { BookingDatabase } from "../../../../features/persistence/BookingDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "application/json");

  const { code } = req.query;

  if (typeof code !== "string") {
    return res.status(400).end(
      JSON.stringify({
        error: {
          code: 400,
          message: "Call error",
          errors: {
            method: ["code can not be blank"],
          },
        },
      })
    );
  }

  try {
    const database = new BookingDatabase();
    const reservations = await database.getBookingByCode(code);

    return res.status(201).end(
      JSON.stringify({
        data: {
          ...reservations,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
