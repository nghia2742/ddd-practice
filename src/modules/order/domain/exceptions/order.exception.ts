import { DomainException } from '@/exceptions';

/**
 * Exception thrown when order operations violate business rules
 */
export class OrderDomainException extends DomainException {
  constructor(message: string, code: string = 'ORDER_ERROR') {
    super(message, code);
  }
}

/**
 * Exception thrown when order status transition is invalid
 */
export class InvalidOrderStatusException extends OrderDomainException {
  constructor(currentStatus: string, attemptedStatus: string) {
    super(
      `Cannot transition order from status '${currentStatus}' to '${attemptedStatus}'`,
      'INVALID_ORDER_STATUS',
    );
  }
}

/**
 * Exception thrown when order item quantity is invalid
 */
export class InvalidOrderItemQuantityException extends OrderDomainException {
  constructor(quantity: number) {
    super(
      `Order item quantity must be greater than 0, got ${quantity}`,
      'INVALID_ORDER_ITEM_QUANTITY',
    );
  }
}

/**
 * Exception thrown when discount is invalid
 */
export class InvalidDiscountException extends OrderDomainException {
  constructor(message: string = 'Invalid discount value') {
    super(message, 'INVALID_DISCOUNT');
  }
}

/**
 * Exception thrown when money value is invalid
 */
export class InvalidMoneyException extends OrderDomainException {
  constructor(message: string = 'Invalid money value') {
    super(message, 'INVALID_MONEY');
  }
}

/**
 * Exception thrown when insufficient stock
 */
export class InsufficientStockException extends OrderDomainException {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product '${productId}'. Requested: ${requested}, Available: ${available}`,
      'INSUFFICIENT_STOCK',
    );
  }
}

/**
 * Exception thrown when address is invalid
 */
export class InvalidAddressException extends OrderDomainException {
  constructor(message: string = 'Invalid address') {
    super(message, 'INVALID_ADDRESS');
  }
}

/**
 * Exception thrown when quantity is invalid
 */
export class InvalidQuantityException extends OrderDomainException {
  constructor(message: string = 'Invalid quantity') {
    super(message, 'INVALID_QUANTITY');
  }
}
