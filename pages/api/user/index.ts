import type { NextApiRequest, NextApiResponse } from "next";
import { ReservationDatabase } from "../../../features/persistence/ReservationDatabase";
import { UserDatabase } from "../../../features/persistence/users/UserDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "application/json");

  const doesAuthorizationHeaderExist = req.headers["authorization"];

  if (!doesAuthorizationHeaderExist) {
    return unauthorized(res);
  } else {
    const database = new UserDatabase();
    try {
      const documentNumber = getDocumentNumberFromRequest(req);

      if (!documentNumber) {
        return unauthorized(res);
      }

      await database.throwIfDoesNotExistByDocumentNumber(documentNumber);
    } catch {
      return unauthorized(res);
    }
  }

  try {
    const database = new UserDatabase();

    const documentNumber = getDocumentNumberFromRequest(req);

    if (!documentNumber) {
      throw new Error("documentNumber is falsy");
    }

    const user = await database.getUserByDocumentNumber(documentNumber);

    return res.status(200).end(
      JSON.stringify({
        user,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
function getDocumentNumberFromRequest(req: NextApiRequest) {
  return req.headers["authorization"]?.split("Bearer ")[1];
}

function unauthorized(res: NextApiResponse<string>) {
  return res.status(401).end(
    JSON.stringify({
      error: {
        code: 401,
        message: "Unauthorized",
      },
    })
  );
}
