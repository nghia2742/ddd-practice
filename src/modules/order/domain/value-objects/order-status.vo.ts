export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class OrderStatusVO {
  private readonly value: OrderStatus;

  constructor(value: OrderStatus) {
    this.value = value;
  }

  static pending(): OrderStatusVO {
    return new OrderStatusVO(OrderStatus.PENDING);
  }

  static paid(): OrderStatusVO {
    return new OrderStatusVO(OrderStatus.PAID);
  }

  static shipped(): OrderStatusVO {
    return new OrderStatusVO(OrderStatus.SHIPPED);
  }

  static delivered(): OrderStatusVO {
    return new OrderStatusVO(OrderStatus.DELIVERED);
  }

  static cancelled(): OrderStatusVO {
    return new OrderStatusVO(OrderStatus.CANCELLED);
  }

  getValue(): OrderStatus {
    return this.value;
  }

  canTransitionTo(newStatus: OrderStatusVO): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return transitions[this.value].includes(newStatus.value);
  }

  equals(other: OrderStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isPending(): boolean {
    return this.value === OrderStatus.PENDING;
  }

  isPaid(): boolean {
    return this.value === OrderStatus.PAID;
  }

  isShipped(): boolean {
    return this.value === OrderStatus.SHIPPED;
  }

  isDelivered(): boolean {
    return this.value === OrderStatus.DELIVERED;
  }

  isCancelled(): boolean {
    return this.value === OrderStatus.CANCELLED;
  }
}
