import { ApplicationException } from './application.exception';

/**
 * Exception thrown when validation fails
 */
export class ValidationException extends ApplicationException {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 422);
    this.errors = errors || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
