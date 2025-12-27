import { ApplicationException, NotFoundException } from '@/exceptions';

/**
 * Exception thrown in order application layer
 */
export class OrderApplicationException extends ApplicationException {
  constructor(message: string, code: string = 'ORDER_APPLICATION_ERROR') {
    super(message, code, 400);
  }
}

/**
 * Exception thrown when order is not found
 */
export class OrderNotFoundException extends NotFoundException {
  public readonly code: string;

  constructor(orderId: string) {
    super('Order', orderId);
    this.code = 'ORDER_NOT_FOUND';
  }
}

/**
 * Exception thrown when order operation fails
 */
export class OrderOperationFailedException extends OrderApplicationException {
  constructor(operation: string, reason: string) {
    super(`Failed to ${operation} order: ${reason}`, 'ORDER_OPERATION_FAILED');
  }
}
