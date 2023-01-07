import type { NextApiRequest, NextApiResponse } from "next";
import {
  PassengerDatabase,
  PassengerDoesNotExistError,
} from "../../../../features/persistence/passengers/PassengerDatabase";

import {
  SeatDatabase,
  SeatIsOccupiedError,
} from "../../../../features/persistence/SeatDatabase";
import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../../../features/validator";

const SEAT_REGEXP = /^[0-9]{1}[A-Z]{1}$/;

const VERB_TO_FUNCTION: {
  [key: string]: (
    req: NextApiRequest,
    res: NextApiResponse<string>
  ) => Promise<NextApiResponse<string>>;
} = {
  GET: async (req: NextApiRequest, res: NextApiResponse<string>) =>
    await getHandler(req, res),
  PATCH: async (req: NextApiRequest, res: NextApiResponse<string>) =>
    await patchHandler(req, res),
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    await callAppropriateFunctionDependingOnVerb(req, res);
  } catch {
    res.setHeader("Allow", "GET, PATCH");
    res.status(405).end();
  }
}

async function callAppropriateFunctionDependingOnVerb(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  await VERB_TO_FUNCTION[req.method || "GET"](req, res);
}

async function getHandler(req: NextApiRequest, res: NextApiResponse<string>) {
  res.setHeader("Content-Type", "application/json");

  const { code } = req.query;

  if (typeof code !== "string") {
    return res.status(400).end(
      JSON.stringify({
        error: {
          code: 400,
          message: "Call error",
          errors: {
            method: ["code can not be blank"],
          },
        },
      })
    );
  }

  try {
    const database = new SeatDatabase();

    const reservations = await database.getOccupiedSeatsByCode(code);

    return res.status(201).end(
      JSON.stringify({
        data: {
          ...reservations,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse<string>) {
  const errors: ErrorsContainer = {
    passenger: [],
    seat: [],
    type: [],
    code: [],
  };

  res.setHeader("Content-Type", "application/json");

  const { code: bookingCode } = req.query;

  const { passenger: passengerId, seat, type } = req.body;

  if (typeof bookingCode !== "string") {
    errors.code.push(ValidationErrors.cannotBeBlank("code"));
  } else {
    if (!passengerId) {
      errors.passenger.push(ValidationErrors.cannotBeBlank("passenger"));
    } else {
      const database = new PassengerDatabase();
      try {
        await database.throwIfPassengerDoesNotExist(bookingCode, passengerId);
      } catch (error) {
        if (error instanceof PassengerDoesNotExistError) {
          return res.status(403).end(
            JSON.stringify({
              error: {
                code: 403,
                message: "Passenger does not apply to booking",
              },
            })
          );
        }
      }
    }
  }

  if (!seat) {
    errors.seat.push(ValidationErrors.cannotBeBlank("seat"));
  } else if (!SEAT_REGEXP.test(seat)) {
    errors.seat.push(ValidationErrors.shouldBeOfSeatFormat());
  } else if (typeof bookingCode === "string") {
    const database = new SeatDatabase();
    try {
      await database.throwIfSeatIsOccupied(bookingCode, passengerId, seat);
    } catch (error) {
      if (error instanceof SeatIsOccupiedError) {
        return res.status(422).end(
          JSON.stringify({
            error: {
              code: 422,
              message: "Seat is occupied",
            },
          })
        );
      }
    }
  }

  if (!type) {
    errors.type.push(ValidationErrors.cannotBeBlank("type"));
  } else if (!["from", "back"].includes(type)) {
    errors.type.push(
      ValidationErrors.shouldBeInValues("type", ["from", "back"])
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
    if (typeof bookingCode !== "string") {
      res.status(500).end();
      throw new Error("bookingCode should be a string");
    }

    try {
      const database = new SeatDatabase();

      const newSeat = await database.getSeatInfoByCodeAndPassengerId(
        bookingCode,
        passengerId,
        type,
        seat
      );

      return res.status(200).end(
        JSON.stringify({
          data: {
            newSeat,
          },
        })
      );
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  }
}
