import { connection } from "../../features/persistence/db";

export class SeatDatabase {
  constructor() {
    connection.connect();
  }

  async getOccupiedSeatsByCode(code: string): Promise<any[]> {
    return await new Promise((resolve, reject) => {
      connection.query(
        `SELECT (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'passenger_id', p.id,
                'place', p.place_from
            )
          )
          FROM bookings b
          JOIN flights f
            ON b.flight_from = f.id
          JOIN passengers p
            ON p.booking_id = b.id
         WHERE p.place_from is not NULL
        ) AS occupied_from,
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'passenger_id', p.id,
                'place', p.place_back
            )
          )
          FROM bookings b
          JOIN flights f
            ON b.flight_back = f.id
          JOIN passengers p
            ON p.booking_id = b.id
         WHERE p.place_back is not NULL
        ) AS occupied_back`,
        [code],
        (err, results) => {
          if (err) {
            return reject(err);
          }

          results[0].occupied_from = JSON.parse(results[0].occupied_from);
          results[0].occupied_back = JSON.parse(results[0].occupied_back);

          return resolve(results[0]);
        }
      );
    });
  }

  dispose() {
    connection.end((err) => console.error(err));
  }
}
