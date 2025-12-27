import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  Type,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseException } from '@/exceptions';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (!(exception instanceof BaseException)) {
      return;
    }

    const statusCode = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const status = statusCode;

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: exception.timestamp,
      path: request.url,
      method: request.method,
      name: exception.name,
      code: exception.code,
      message: exception.message,
    };

    // Include validation errors if available
    if ('errors' in exception && exception.errors) {
      errorResponse.errors = (exception as Record<string, unknown>).errors;
    }

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(exception),
      BaseExceptionFilter.name,
    );

    response.status(status).json(errorResponse);
  }
}
