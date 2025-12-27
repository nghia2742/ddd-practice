/**
 * Base exception class for all application exceptions
 */
export class BaseException extends Error implements Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);

    // Maintain proper prototype chain
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();

    // Ensure proper Error stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}
