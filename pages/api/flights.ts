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
        `SELECT id AS flight_id, flight_code, from_id, to_id, cost 
           FROM flights
          LIMIT 64`,
        [from, passengers],
        function (error, results) {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    const flightsBack = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT id AS flight_id, flight_code, from_id, to_id, cost 
           FROM flights
          LIMIT 64`,
        [to, passengers],
        function (error, results) {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

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
            flightsTo,
            flightsBack,
          },
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
