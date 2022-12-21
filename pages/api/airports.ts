import type { NextApiRequest, NextApiResponse } from "next";

import { connection } from "../../features/persistence/db";
connection.connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const {
      query: { query },
    } = req;

    const results = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT name, iata 
           FROM airports 
          WHERE city LIKE ?
             OR name LIKE ? 
             OR iata = ? 
          LIMIT 64`,
        [`%${query}%`, `%${query}%`, query],
        function (error, results) {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    res.setHeader("Content-Type", "application/json");

    return res.status(200).end(
      JSON.stringify({
        data: {
          items: results,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
