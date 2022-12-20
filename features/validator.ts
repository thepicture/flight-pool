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
};
