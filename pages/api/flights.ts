import type { NextApiRequest, NextApiResponse } from "next";

import { connection } from "../../features/persistence/db";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../features/validator";

connection.connect();

const DATE_REGEXP = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const errors: ErrorsContainer = {
      from: [],
      to: [],
      departureDate: [],
      arrivalDate: [],
      passengers: [],
    };

    const {
      query: { from, to, date1: departureDate, date2: arrivalDate, passengers },
    } = req;

    if (!from) {
      errors.from.push(ValidationErrors.cannotBeBlank("from"));
    }

    if (!to) {
      errors.to.push(ValidationErrors.cannotBeBlank("to"));
    }

    if (!departureDate || typeof departureDate !== "string") {
      errors.departureDate.push(ValidationErrors.cannotBeBlank("to"));
    } else if (!DATE_REGEXP.test(departureDate)) {
      errors.departureDate.push(
        ValidationErrors.incorrectDateFormatYYYYMMDD("departureDate")
      );
    }

    if (typeof arrivalDate === "string") {
      if (!DATE_REGEXP.test(arrivalDate)) {
        errors.arrivalDate.push(
          ValidationErrors.incorrectDateFormatYYYYMMDD("arrivalDate")
        );
      }
    }

    if (!passengers || typeof passengers !== "string") {
      errors.passengers.push(ValidationErrors.cannotBeBlank("passengers"));
    } else if (Number.isNaN(parseInt(passengers))) {
      errors.passengers.push(
        ValidationErrors.shouldBePositiveInteger("passengers")
      );
    }

    const flightsTo = await new Promise((resolve, reject) => {
      connection.query(
        buildFlightsQuery(departureDate, Number(passengers)),
        [from, passengers],
        function (error, results) {
          if (error) {
            return reject(error);
          }

          results.forEach((result: { from: string; to: string }) => {
            result.from = JSON.parse(result.from);
            result.to = JSON.parse(result.to);
          });

          resolve(results);
        }
      );
    });

    const flightsBack = arrivalDate
      ? await new Promise((resolve, reject) => {
          connection.query(
            buildFlightsQuery(departureDate, Number(passengers)),
            [to, passengers],
            function (error, results) {
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
        })
      : [];

    res.setHeader("Content-Type", "application/json");

    if (Validator.hasErrors(errors)) {
      return res
        .status(422)
        .end(
          Validator.createStringifiedErrorObject(
            422,
            ValidationErrors.VALIDATION_ERROR,
            errors
          )
        );
    } else {
      return res.status(200).end(
        JSON.stringify({
          data: {
            flights_to: flightsTo,
            flights_back: flightsBack,
          },
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
function buildFlightsQuery(
  departureDate: string | string[] | undefined,
  passengerCount: number
) {
  return `    SELECT f.id as flight_id, 
                    flight_code, 
                    JSON_OBJECT(
                      'city', a_departure.city,
                      'airport', a_departure.name,
                      'iata', a_departure.iata,
                      'date', '${departureDate}',
                      'time', DATE_FORMAT(f.time_from, '%h:%i')
                    ) as 'from',
                    JSON_OBJECT(
                      'city', a_arrival.city,
                      'airport', a_arrival.name,
                      'iata', a_arrival.iata,
                      'date', '${departureDate}',
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
                             AND (SELECT COUNT(*) FROM passengers WHERE booking_id = id) > ${passengerCount}
                             AND DATE_FORMAT(date_from, '%y-%M-%d') = '${departureDate}'
                          )
                    ) as availability
               FROM flights f
         INNER JOIN airports a_departure
                 ON f.from_id = a_departure.id
         INNER JOIN airports a_arrival
                 ON f.to_id = a_arrival.id
         INNER JOIN bookings b
                 ON b.flight_from = f.id
         INNER JOIN passengers p
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
                       AND DATE_FORMAT(date_from, '%y-%M-%d') = '${departureDate}'
                    )
              ) >= ${passengerCount}
              LIMIT 64`;
}
