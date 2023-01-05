export interface ErrorsContainer {
  [key: string]: string[];
}

export const Validator = {
  createStringifiedErrorObject: (
    code: number,
    message: string,
    errors: ErrorsContainer
  ) =>
    JSON.stringify({
      error: {
        code,
        message,
        errors,
      },
    }),
  hasErrors: (errors: ErrorsContainer) => {
    for (const error in errors) {
      if (errors[error].length > 0) {
        return true;
      }
    }

    return false;
  },
};

export const ValidationErrors = {
  VALIDATION_ERROR: "Validation error",
  UNAUTHORIZED: "Unauthorized",
  cannotBeBlank: (field: string) => `field ${field} can not be blank`,
  nDigitsAndCanStartWithZero: (field: string, digits: number) =>
    `field ${field} should be ${digits} digits long and can start with leading zero`,
  credentialsIncorrect: "phone or password incorrect",
  incorrectDateFormatYYYYMMDD: (field: string) =>
    `field ${field} should be in format YYYY-MM-DD`,
  shouldBePositiveInteger: (field: string) =>
    `field ${field} should be positive integer`,
  shouldBeOfDateFormat: (field: string) =>
    `field ${field} should be of format YYYY-MM-DD`,
  shouldBeOfDocumentFormat: (field: string) =>
    `field ${field} should be 10 digits long`,
  cannotBeEmptyArray: (field: string) => `field ${field} cannot be empty array`,
};
