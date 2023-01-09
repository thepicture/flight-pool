import { createConnection } from "./db";

import { StringGenerator } from "../generators/StringGenerator";

const MAX_SAFE_COUNT_OF_CODES = (122 - 97 + 1) ** 5;

export class BookingDatabase {
  async getBookingByCode(code: string): Promise<any[]> {
    const connection = createConnection();

    return await new Promise((resolve, reject) => {
      connection.query(
        `SELECT code, (f1.cost + f2.cost) as cost, JSON_ARRAY(
            JSON_OBJECT(
                'flight_id', f1.id,
                'flight_code', f1.flight_code,
                'from', JSON_OBJECT(
                    'city', a1f.city,
                    'airport', a1f.name,
                    'iata', a1f.iata,
                    'date', b.date_from,
                    'time', f1.time_from
                ),
                'to', JSON_OBJECT(
                    'city', a1t.city,
                    'airport', a1t.name,
                    'iata', a1t.iata,
                    'date', b.date_from,
                    'time', f1.time_to
                ),
                'cost', f1.cost,
                'availability', (SELECT COUNT(*) FROM passengers WHERE booking_id = b.id) - (SELECT COUNT(*) from bookings b RIGHT JOIN passengers p ON b.id = p.booking_id = 0)
            ),
            JSON_OBJECT(
                'flight_id', f2.id,
                'flight_code', f2.flight_code,
                'from', JSON_OBJECT(
                    'city', a2f.city,
                    'airport', a2f.name,
                    'iata', a2f.iata,
                    'date', b.date_back,
                    'time', f2.time_from
                ),
                'to', JSON_OBJECT(
                    'city', a2t.city,
                    'airport', a2t.name,
                    'iata', a2t.iata,
                    'date', b.date_back,
                    'time', f2.time_to
                ),
                'cost', f2.cost,
                'availability', (SELECT COUNT(*) FROM passengers WHERE booking_id = b.id) - (SELECT COUNT(*) from bookings b RIGHT JOIN passengers p ON b.id = p.booking_id = 0)
            )
        ) as flights, 
        ( SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'birth_date', birth_date,
                'document_number', document_number,
                'place_from', place_from,
                'place_back', place_back
            )
          )
           FROM passengers
          WHERE booking_id = b.id
          LIMIT 1
        ) as passengers
                            FROM bookings b
                      INNER JOIN flights f1 
                              ON b.flight_from = f1.id
                      INNER JOIN flights f2 
                              ON b.flight_back = f2.id
                      INNER JOIN airports a1f 
                              ON a1f.id = f1.from_id
                      INNER JOIN airports a2f 
                              ON a2f.id = f2.from_id
                      INNER JOIN airports a1t 
                              ON a1t.id = f1.to_id
                      INNER JOIN airports a2t 
                              ON a2t.id = f2.to_id
                      INNER JOIN passengers p
                              ON b.id = p.booking_id
                           WHERE b.code = ?`,
        [code],
        (err, results) => {
          if (err) {
            return reject(err);
          }

          results[0].flights = JSON.parse(results[0].flights);
          results[0].passengers = JSON.parse(results[0].passengers);

          results[0].flights = results[0].flights.map(
            (flight: {
              flight_id: number;
              flight_code: string;
              from: any;
              to: any;
              cost: number;
              availability: number;
            }) => ({
              flight_id: flight.flight_id,
              flight_code: flight.flight_code,
              from: flight.from,
              to: flight.to,
              cost: flight.cost,
              availability: flight.availability,
            })
          );

          results[0].passengers = results[0].passengers.map(
            (passenger: {
              id: number;
              first_name: string;
              last_name: string;
              birth_date: string;
              document_number: string;
              place_from: string | null;
              place_back: string | null;
            }) => ({
              id: passenger.id,
              first_name: passenger.first_name,
              last_name: passenger.last_name,
              birth_date: passenger.birth_date,
              document_number: passenger.document_number,
              place_from: passenger.place_from,
              place_back: passenger.place_back,
            })
          );

          connection.end();
          return resolve(results[0]);
        }
      );
    });
  }

  async getAllBookingsByDocumentNumber(documentNumber: string) {
    const connection = createConnection();

    return await new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT code, (f1.cost + f2.cost) as cost, JSON_ARRAY(
          JSON_OBJECT(
              'flight_id', f1.id,
              'flight_code', f1.flight_code,
              'from', JSON_OBJECT(
                  'city', a1f.city,
                  'airport', a1f.name,
                  'iata', a1f.iata,
                  'date', b.date_from,
                  'time', f1.time_from
              ),
              'to', JSON_OBJECT(
                  'city', a1t.city,
                  'airport', a1t.name,
                  'iata', a1t.iata,
                  'date', b.date_from,
                  'time', f1.time_to
              ),
              'cost', f1.cost,
              'availability', (SELECT COUNT(*) FROM passengers WHERE booking_id = b.id) - (SELECT COUNT(*) from bookings b RIGHT JOIN passengers p ON b.id = p.booking_id = 0)
          ),
          JSON_OBJECT(
              'flight_id', f2.id,
              'flight_code', f2.flight_code,
              'from', JSON_OBJECT(
                  'city', a2f.city,
                  'airport', a2f.name,
                  'iata', a2f.iata,
                  'date', b.date_back,
                  'time', f2.time_from
              ),
              'to', JSON_OBJECT(
                  'city', a2t.city,
                  'airport', a2t.name,
                  'iata', a2t.iata,
                  'date', b.date_back,
                  'time', f2.time_to
              ),
              'cost', f2.cost,
              'availability', (SELECT COUNT(*) FROM passengers WHERE booking_id = b.id) - (SELECT COUNT(*) from bookings b RIGHT JOIN passengers p ON b.id = p.booking_id = 0)
          )
      ) as flights, 
      ( SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', id,
              'first_name', first_name,
              'last_name', last_name,
              'birth_date', birth_date,
              'document_number', document_number,
              'place_from', place_from,
              'place_back', place_back
          )
        )
         FROM passengers
        WHERE booking_id = b.id
      ) as passengers
                          FROM bookings b
                    INNER JOIN flights f1 
                            ON b.flight_from = f1.id
                    INNER JOIN flights f2 
                            ON b.flight_back = f2.id
                    INNER JOIN airports a1f 
                            ON a1f.id = f1.from_id
                    INNER JOIN airports a2f 
                            ON a2f.id = f2.from_id
                    INNER JOIN airports a1t 
                            ON a1t.id = f1.to_id
                    INNER JOIN airports a2t 
                            ON a2t.id = f2.to_id
                    INNER JOIN passengers p
                            ON b.id = p.booking_id
                         WHERE p.document_number = ?
      `,
        [documentNumber],
        (error, results) => {
          if (error) {
            reject(error);
          }

          results[0].flights = JSON.parse(results[0].flights);
          results[0].passengers = JSON.parse(results[0].passengers);

          connection.end();
          resolve(results);
        }
      );
    });
  }

  async getUniqueBookingCodeOrThrowIfLimitReached() {
    const connection = createConnection();

    return await new Promise((resolve, reject) => {
      connection.query(
        `SELECT code FROM bookings`,
        [],
        (err, results: any[]) => {
          if (err) {
            return reject(err);
          }

          if (results.length > MAX_SAFE_COUNT_OF_CODES) {
            throw new Error(
              `no more codes available, 
               should check bookings in the database 
               and remove old entries 
               or allow codes to be greater 
               than 5 digit long`
            );
          }

          let bookingCode;

          while (true) {
            bookingCode = StringGenerator.generate(5).toUpperCase();
            if (!results.includes(bookingCode)) {
              break;
            }
          }

          connection.end();

          return resolve(bookingCode);
        }
      );
    });
  }
}
