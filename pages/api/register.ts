import type { NextApiRequest, NextApiResponse } from "next";

import {
  ErrorsContainer,
  ValidationErrors,
  Validator,
} from "../../features/validator";

const DOCUMENT_NUMBER_REGEXP = /^\d{10}$/;
const DOCUMENT_DIGIT_COUNT = 10;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const errors: ErrorsContainer = {
    first_name: [],
    last_name: [],
    phone: [],
    document_number: [],
    password: [],
  };

  const { first_name, last_name, phone, document_number, password } = req.body;

  if (!first_name) {
    errors["first_name"].push(ValidationErrors.cannotBeBlank("first_name"));
  }

  if (!last_name) {
    errors["last_name"].push(ValidationErrors.cannotBeBlank("last_name"));
  }

  if (!phone) {
    errors.phone.push(ValidationErrors.cannotBeBlank("phone"));
  }

  if (!document_number) {
    errors["document_number"].push(
      ValidationErrors.cannotBeBlank("document_number")
    );
  }

  if (!DOCUMENT_NUMBER_REGEXP.test(document_number)) {
    errors["document_number"].push(
      ValidationErrors.nDigitsAndCanStartWithZero(
        "document_number",
        DOCUMENT_DIGIT_COUNT
      )
    );
  }

  if (!password) {
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
  } else {
    return res.status(204).end();
  }
}
