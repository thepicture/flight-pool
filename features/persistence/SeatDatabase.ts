import { createConnection } from "../../features/persistence/db";

export class SeatIsOccupiedError extends Error {}

export class SeatDatabase {
  async getOccupiedSeatsByCode(code: string): Promise<any[]> {
    const connection = createConnection();

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

          connection.end();

          console.log("@@@@", JSON.stringify(results));

          return resolve(results[0]);
        }
      );
    });
  }

  async getSeatInfoByCodeAndPassengerId(
    bookingCode: string,
    passengerId: number,
    seatType: "from" | "back",
    seat: string
  ): Promise<any[]> {
    const connection = createConnection();

    return await new Promise((resolve, reject) => {
      connection.query(
        `SELECT p.id, first_name, last_name, birth_date, document_number, place_from, place_back
                          FROM passengers p
                          JOIN bookings b
                            ON p.booking_id = b.id
                         WHERE b.code = ?
                           AND p.id = ?
                          `,
        [bookingCode, passengerId],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          results[0][`place_${seatType}`] = seat;

          connection.end();

          resolve(results[0]);
        }
      );
    });
  }

  async throwIfSeatIsOccupied(
    bookingCode: string,
    passengerId: number,
    seat: string
  ) {
    const connection = createConnection();

    const seats: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT *
           FROM passengers p
           JOIN bookings b
             ON p.booking_id = b.id
          WHERE p.place_from = ? OR p.place_back = ?`,
        [seat, seat],
        (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    if (seats.length > 0) {
      throw new SeatIsOccupiedError();
    }

    connection.end();
  }
}
