import { BaseException } from './base.exception';

/**
 * Application exception - represents application-level errors
 */
export class ApplicationException extends BaseException {
  constructor(
    message: string,
    code: string = 'APPLICATION_ERROR',
    statusCode: number = 400,
  ) {
    super(message, code, statusCode);
  }
}
