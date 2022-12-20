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
    firstName: [],
    lastName: [],
    phone: [],
    documentNumber: [],
    password: [],
  };

  const { body } = req;

  if (!body.firstName) {
    errors.firstName.push(ValidationErrors.cannotBeBlank("firstName"));
  }

  if (!body.lastName) {
    errors.lastName.push(ValidationErrors.cannotBeBlank("lastName"));
  }

  if (!body.phone) {
    errors.phone.push(ValidationErrors.cannotBeBlank("phone"));
  }

  if (!body.documentNumber) {
    errors.documentNumber.push(
      ValidationErrors.cannotBeBlank("documentNumber")
    );
  }

  if (!DOCUMENT_NUMBER_REGEXP.test(body.documentNumber)) {
    errors.documentNumber.push(
      ValidationErrors.nDigitsAndCanStartWithZero(
        "documentNumber",
        DOCUMENT_DIGIT_COUNT
      )
    );
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
  } else {
    return res.status(204).end();
  }
}
