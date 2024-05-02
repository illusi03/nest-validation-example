import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';

export class ValidationException extends BadRequestException {
  public messageErrors;
  public validationErrors;

  constructor(validationErrors: any, messageErrors?: any) {
    super();
    this.messageErrors = messageErrors;
    this.validationErrors = validationErrors;
  }
}

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    return response.status(400).json({
      message: exception.messageErrors,
      error: 'Bad Request',
      statusCode: 400,
      data: exception.validationErrors,
    });
  }
}

export const exceptionFactory = (errors: ValidationError[]) => {
  const errorValidation = {};
  let errorMessages = [];
  const parseErrorMessage = (errObject, propertyKey) => {
    const isNested =
      typeof errObject?.children !== 'undefined' &&
      errObject?.children.length > 0;
    if (!isNested) {
      const messages = Object.values(errObject?.constraints);
      errorValidation[`${propertyKey}`] = [...messages];
      errorMessages.push(messages); // Default property message error
      return true;
    }
    errObject?.children.map((valChild) => {
      const nextPropertyKey = `${propertyKey}.${valChild.property}`;
      parseErrorMessage(valChild, nextPropertyKey);
    });
  };
  errors.forEach((err) => {
    parseErrorMessage(err, err.property);
  });
  errorMessages = errorMessages.flat(1); // Default property message error
  return new ValidationException(errorValidation, errorMessages);
};
