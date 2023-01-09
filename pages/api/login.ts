import type { NextApiRequest, NextApiResponse } from "next";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../features/validator";

const TEST_CREDENTIALS = {
  phone: "89001234567",
  password: "paSSword",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const errors: ErrorsContainer = {
    phone: [],
    password: [],
  };

  const { body } = req;

  if (!body.phone) {
    errors.phone.push(ValidationErrors.cannotBeBlank("phone"));
  }

  if (!body.password) {
    errors.password.push(ValidationErrors.cannotBeBlank("password"));
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
  } else if (!areCredentialsCorrect(body)) {
    errors.phone.push(ValidationErrors.credentialsIncorrect);
    return res
      .status(401)
      .end(
        Validator.createStringifiedErrorObject(
          401,
          ValidationErrors.UNAUTHORIZED,
          errors
        )
      );
  } else {
    return res.status(200).end(
      JSON.stringify({
        data: {
          token: getToken(),
        },
      })
    );
  }
}
export const areCredentialsCorrect = ({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) =>
  phone === TEST_CREDENTIALS.phone && password === TEST_CREDENTIALS.password;

export const getToken = () => Math.random().toString(36).split(".")[1];
