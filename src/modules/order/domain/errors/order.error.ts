export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export class OrderStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderStatusError';
  }
}

export class OrderItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderItemError';
  }
}
