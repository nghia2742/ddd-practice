export enum OrderStatusCode {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class OrderStatus {
  private readonly value: OrderStatusCode;

  constructor(value: OrderStatusCode) {
    this.value = value;
  }

  static pending(): OrderStatus {
    return new OrderStatus(OrderStatusCode.PENDING);
  }

  static paid(): OrderStatus {
    return new OrderStatus(OrderStatusCode.PAID);
  }

  static shipped(): OrderStatus {
    return new OrderStatus(OrderStatusCode.SHIPPED);
  }

  static delivered(): OrderStatus {
    return new OrderStatus(OrderStatusCode.DELIVERED);
  }

  static cancelled(): OrderStatus {
    return new OrderStatus(OrderStatusCode.CANCELLED);
  }

  getValue(): OrderStatusCode {
    return this.value;
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    const transitions: Record<OrderStatusCode, OrderStatusCode[]> = {
      [OrderStatusCode.PENDING]: [
        OrderStatusCode.PAID,
        OrderStatusCode.CANCELLED,
      ],
      [OrderStatusCode.PAID]: [
        OrderStatusCode.SHIPPED,
        OrderStatusCode.CANCELLED,
      ],
      [OrderStatusCode.SHIPPED]: [OrderStatusCode.DELIVERED],
      [OrderStatusCode.DELIVERED]: [],
      [OrderStatusCode.CANCELLED]: [],
    };

    return transitions[this.value].includes(newStatus.value);
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isPending(): boolean {
    return this.value === OrderStatusCode.PENDING;
  }

  isPaid(): boolean {
    return this.value === OrderStatusCode.PAID;
  }

  isShipped(): boolean {
    return this.value === OrderStatusCode.SHIPPED;
  }

  isDelivered(): boolean {
    return this.value === OrderStatusCode.DELIVERED;
  }

  isCancelled(): boolean {
    return this.value === OrderStatusCode.CANCELLED;
  }
}
