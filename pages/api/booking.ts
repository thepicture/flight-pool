import type { NextApiRequest, NextApiResponse } from "next";

import { connection } from "../../features/persistence/db";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../features/validator";

connection.connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(400).end(
      JSON.stringify({
        error: {
          code: 400,
          message: "Call error",
          errors: {
            method: ["endpoint supports only POST verb"],
          },
        },
      })
    );
  }

  try {
    const errors: ErrorsContainer = {
      flight_from: [],
      flight_back: [],
      passengers: [],
    };

    const { flight_from, flight_back, passengers } = req.body;

    if (!flight_from) {
      errors.from.push(ValidationErrors.cannotBeBlank("from"));
    }

    if (!flight_back) {
      errors.to.push(ValidationErrors.cannotBeBlank("flight_back"));
    }

    if (!passengers) {
      errors.passengers.push(ValidationErrors.cannotBeBlank("passengers"));
    } else if (!Array.isArray(passengers)) {
      errors.passengers.push(ValidationErrors.cannotBeEmptyArray("passengers"));
    }

    if (passengers.length === 0) {
      errors.passengers.push(
        ValidationErrors.shouldBePositiveInteger("passengers")
      );
    } else {
      if (
        passengers.some(
          (passenger: { first_name: string }) => !passenger.first_name
        )
      ) {
        ValidationErrors.cannotBeBlank("first_name");
      }

      if (
        passengers.some(
          (passenger: { last_name: string }) => !passenger.last_name
        )
      ) {
        ValidationErrors.cannotBeBlank("last_name");
      }

      if (
        passengers.some(
          (passenger: { birth_date: string }) => !passenger.birth_date
        )
      ) {
        ValidationErrors.cannotBeBlank("birth_date");
      } else if (
        passengers.some(
          (passenger: { birth_date: string }) =>
            !/\d{4}-\d{2}-\d{2}/.test(passenger.birth_date)
        )
      ) {
        ValidationErrors.shouldBeOfDateFormat("birth_date");
      }

      if (
        passengers.some(
          (passenger: { document_number: string }) => !passenger.document_number
        )
      ) {
        ValidationErrors.cannotBeBlank("document_number");
      } else if (
        passengers.some(
          (passenger: { document_number: string }) =>
            !/\d{10}/.test(passenger.document_number)
        )
      ) {
        ValidationErrors.shouldBeOfDocumentFormat("document_number");
      }
    }

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
      return res.status(201).end(
        JSON.stringify({
          data: {
            code: new Array(5)
              .fill(null)
              .map(() =>
                String.fromCharCode(
                  Math.floor(Math.random() * (122 - 97 + 1) + 97)
                )
              )
              .join("")
              .toUpperCase(),
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
