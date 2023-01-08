import type { NextApiRequest, NextApiResponse } from "next";

import { AirportDatabase } from "../../features/persistence/airports/AirportDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "application/json");

  const { query } = req.query;

  try {
    if (typeof query !== "string") {
      throw new Error("query should be presented");
    }

    const database = new AirportDatabase();

    const airports = await database.getAirportsByQuery(query);

    return res.status(200).end(
      JSON.stringify({
        data: {
          items: airports,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
