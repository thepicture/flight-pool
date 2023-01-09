import type { NextApiRequest, NextApiResponse } from "next";

import { FlightDatabase } from "../../../features/persistence/flights/FlightDatabase";

import { BookingDatabase } from "../../../features/persistence/BookingDatabase";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../../features/validator";

const BIRTH_DATE_REGEXP_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const DOCUMENT_REGEXP_FORMAT = /^\d{10}$/;

const writeErrorsFromFlightIfTheyExistAndReturnTrueIfTheyDoExist = (
  flight: { id?: number; date?: string },
  errors: string[]
) => {
  if (!flight.id) {
    errors.push(ValidationErrors.cannotBeBlank("id"));
  }

  if (!flight.date) {
    errors.push(ValidationErrors.cannotBeBlank("date"));
  } else if (!BIRTH_DATE_REGEXP_FORMAT.test(flight.date)) {
    errors.push(ValidationErrors.shouldBeOfDateFormat("date"));
  }

  return errors.length > 0;
};

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

    const flightDatabase = new FlightDatabase();

    if (!flight_from) {
      errors.flight_from.push(ValidationErrors.cannotBeBlank("flight_from"));
    } else {
      if (
        !writeErrorsFromFlightIfTheyExistAndReturnTrueIfTheyDoExist(
          flight_from,
          errors.flight_from
        )
      ) {
        if (!(await flightDatabase.doesFlightExist(flight_from.id))) {
          errors.flight_from.push(ValidationErrors.doesNotExist("flight_from"));
        } else if (
          !(await flightDatabase.isFlightAvailable(
            flight_from,
            passengers || Number.MAX_SAFE_INTEGER
          ))
        ) {
          errors.flight_from.push(
            ValidationErrors.flightIsNotAvailable("flight_from")
          );
        }
      }
    }

    if (!flight_back) {
      errors.flight_back.push(ValidationErrors.cannotBeBlank("flight_back"));
    } else {
      if (
        !writeErrorsFromFlightIfTheyExistAndReturnTrueIfTheyDoExist(
          flight_back,
          errors.flight_back
        )
      ) {
        if (!(await flightDatabase.doesFlightExist(flight_back.id))) {
          errors.flight_back.push(ValidationErrors.doesNotExist("flight_back"));
        } else if (
          !(await flightDatabase.isFlightAvailable(
            flight_back,
            passengers || Number.MAX_SAFE_INTEGER
          ))
        ) {
          errors.flight_back.push(
            ValidationErrors.flightIsNotAvailable("flight_back")
          );
        }
      }
    }

    if (!passengers) {
      errors.passengers.push(ValidationErrors.cannotBeBlank("passengers"));
    } else if (!Array.isArray(passengers)) {
      errors.passengers.push(ValidationErrors.cannotBeEmptyArray("passengers"));
    }

    if (passengers?.length === 0) {
      errors.passengers.push(
        ValidationErrors.shouldBePositiveInteger("passengers")
      );
    } else {
      if (
        passengers?.some(
          (passenger: { first_name: string }) => !passenger.first_name
        )
      ) {
        errors.passengers.push(ValidationErrors.cannotBeBlank("first_name"));
      }

      if (
        passengers?.some(
          (passenger: { last_name: string }) => !passenger.last_name
        )
      ) {
        errors.passengers.push(ValidationErrors.cannotBeBlank("last_name"));
      }

      if (
        passengers?.some(
          (passenger: { birth_date: string }) => !passenger.birth_date
        )
      ) {
        errors.passengers.push(ValidationErrors.cannotBeBlank("birth_date"));
      } else if (areSomeBirthDatesIncorrect(passengers)) {
        errors.passengers.push(
          ValidationErrors.shouldBeOfDateFormat("birth_date")
        );
      }

      if (
        passengers?.some(
          (passenger: { document_number: string }) => !passenger.document_number
        )
      ) {
        errors.passengers.push(
          ValidationErrors.cannotBeBlank("document_number")
        );
      } else if (areSomeDocumentFormatsIncorect(passengers)) {
        errors.passengers.push(
          ValidationErrors.shouldBeOfDocumentFormat("document_number")
        );
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
      const bookingDatabase = new BookingDatabase();

      return res.status(201).end(
        JSON.stringify({
          data: {
            code: await bookingDatabase.getUniqueBookingCodeOrThrowIfLimitReached(),
          },
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
function areSomeBirthDatesIncorrect(passengers: any) {
  return passengers?.some(
    (passenger: { birth_date: string }) =>
      !BIRTH_DATE_REGEXP_FORMAT.test(passenger.birth_date)
  );
}

function areSomeDocumentFormatsIncorect(passengers: any) {
  return passengers?.some(
    (passenger: { document_number: string }) =>
      !DOCUMENT_REGEXP_FORMAT.test(passenger.document_number)
  );
}
