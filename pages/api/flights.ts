import type { NextApiRequest, NextApiResponse } from "next";

import { FlightDatabase } from "../../features/persistence/flights/FlightDatabase";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../features/validator";

const DATE_REGEXP = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "application/json");

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
      if (
        typeof from !== "string" ||
        typeof to !== "string" ||
        typeof departureDate !== "string" ||
        (arrivalDate && typeof arrivalDate !== "string") ||
        typeof passengers !== "string"
      ) {
        throw new Error(
          "query params should be either string or not presented"
        );
      }

      const passengerCount = Number(passengers);

      if (![1, 2, 3, 4, 5, 6, 7, 8].includes(passengerCount)) {
        throw new Error(
          "passenger count should be an integer in closed interval 1-8"
        );
      }

      const database = new FlightDatabase();

      const flightsTo = await database.getFlightsByParams({
        from,
        to,
        date1: departureDate,
        date2: arrivalDate,
        passengers: passengerCount,
      });

      const flightsBack = arrivalDate
        ? await database.getFlightsByParams({
            from,
            to,
            date2: arrivalDate,
            date1: departureDate,
            passengers: passengerCount,
          })
        : [];

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
