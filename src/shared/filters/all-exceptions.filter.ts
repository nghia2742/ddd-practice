import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Catch all unhandled exceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        AllExceptionsFilter.name,
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      code,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
