import { BaseException } from './base.exception';

/**
 * Domain exception - represents business logic violations
 */
export class DomainException extends BaseException {
  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message, code, 400);
  }
}
