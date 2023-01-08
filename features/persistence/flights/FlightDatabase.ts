import { createConnection } from "../../../features/persistence/db";

export interface AirportSearchParams {
  from: string;
  to: string;
  date1: string;
  date2?: string;
  passengers: number;
}

export class FlightDatabase {
  async getFlightsByParams(params: AirportSearchParams) {
    const connection = createConnection();

    const { date1, date2, passengers, from, to } = params;

    const airports: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `    SELECT DISTINCT f.id as flight_id, 
                    flight_code, 
                    JSON_OBJECT(
                      'city', a_arrival.city,
                      'airport', a_arrival.name,
                      'iata', a_arrival.iata,
                      'date', ?,
                      'time', DATE_FORMAT(f.time_from, '%h:%i')
                    ) as 'from',
                    JSON_OBJECT(
                      'city', a_departure.city,
                      'airport', a_departure.name,
                      'iata', a_departure.iata,
                      'date', ?,
                      'time', DATE_FORMAT(f.time_to, '%h:%i')
                    ) as 'to',
                    f.cost,
                    (
                      (SELECT COUNT(*) 
                         FROM bookings 
                        WHERE flight_from = f.id
                      ) - (
                          SELECT COUNT(*) 
                            FROM bookings 
                           WHERE flight_from = f.id
                             AND (SELECT COUNT(*) FROM passengers WHERE booking_id = id) > ?
                             AND DATE_FORMAT(date_from, '%y-%M-%d') = ?
                          )
                    ) as availability
               FROM flights f
               JOIN airports a_departure
                 ON f.from_id = a_departure.id
               JOIN airports a_arrival
                 ON f.to_id = a_arrival.id
               JOIN bookings b
                 ON b.flight_from = f.id
               JOIN passengers p
                 ON p.booking_id = b.id
              WHERE (
                (SELECT COUNT(*) 
                   FROM bookings 
                  WHERE flight_from = f.id
                ) - (
                    SELECT COUNT(*) 
                      FROM bookings 
                     WHERE flight_from = f.id
                       AND (SELECT COUNT(*) FROM passengers WHERE booking_id = id) > 0
                       AND DATE_FORMAT(date_from, '%y-%M-%d') = ?
                    )
              ) >= ?
              AND a_arrival.iata LIKE ?
              AND a_departure.iata LIKE ?
              LIMIT 64`,
        [
          date1,
          date2,
          passengers,
          date1,
          date1,
          passengers,
          `%${from}%`,
          `%${to}%`,
        ],
        (error, results) => {
          if (error) {
            reject(error);
          }

          results.forEach((result: { from: string; to: string }) => {
            result.from = JSON.parse(result.from);
            result.to = JSON.parse(result.to);
          });

          resolve(results);
        }
      );
    });

    connection.end();

    return airports;
  }
}
