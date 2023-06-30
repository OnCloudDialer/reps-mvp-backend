import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let message = exception.message;

    if (exception.getResponse() && exception.getResponse()['message']) {
      if (
        typeof exception.getResponse()['message'] === 'object' &&
        exception.getResponse()['message'].length > 0
      ) {
        message = exception.getResponse()['message'][0];
      }
    }
    response.status(status).json({
      error: {
        message: message,
        error: exception.getResponse(),
      },
    });
  }
}
