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
        errors: Validator._getFilledErrorArrays(errors),
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
  _getFilledErrorArrays: (errors: ErrorsContainer) => {
    const filteredErrors: { [key: string]: string[] } = {};
    for (const error in errors) {
      if (errors[error].length > 0) {
        filteredErrors[error] = errors[error];
      }
    }

    return filteredErrors;
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
  doesNotExist: (field: string) =>
    `field ${field} contains a value that does not exist in database`,
  flightIsNotAvailable: (field: string) =>
    `field ${field} contains a flight that is not available for the given date`,
  shouldBeInValues: (field: string, values: string[]) =>
    `field ${field} should be equal to one of these values: ${values.join(
      ", "
    )}`,
  shouldBeOfSeatFormat: () =>
    `seat should consist of two characters: the first is a digit and the second is a latin uppercase letter`,
};
