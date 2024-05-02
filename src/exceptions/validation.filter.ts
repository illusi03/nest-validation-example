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
  const parseErrorMessage = (errObject) => {
    const propertyKey = errObject.property;
    const messages = Object.values(errObject?.constraints);
    errorValidation[`${propertyKey}`] = [...messages];
    errorMessages.push(messages); // Default property message error
    return true;
  };
  errors.forEach((err) => {
    parseErrorMessage(err);
  });
  errorMessages = errorMessages.flat(1); // Default property message error
  return new ValidationException(errorValidation, errorMessages);
};
