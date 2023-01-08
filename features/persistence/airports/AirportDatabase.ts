import { createConnection } from "../../../features/persistence/db";

export class AirportDatabase {
  async getAirportsByQuery(query: string) {
    const connection = createConnection();

    const airports: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT name, iata 
           FROM airports 
          WHERE city LIKE ?
             OR name LIKE ? 
             OR iata LIKE ? 
          LIMIT 64`,
        new Array(3).fill(`%${query}%`),
        (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    connection.end();

    return airports;
  }
}
