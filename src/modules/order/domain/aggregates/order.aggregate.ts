import { AggregateRoot } from '@/kernel/aggregate-root';
import { OrderId } from '#/order/domain/value-objects/order-id.vo';
import { CustomerId } from '#/order/domain/value-objects/customer-id.vo';
import { Money } from '#/order/domain/value-objects/money.vo';
import { Discount } from '#/order/domain/value-objects/discount.vo';
import { ShippingAddress } from '#/order/domain/value-objects/address.vo';
import { OrderStatus } from '#/order/domain/value-objects/order-status.vo';
import { OrderItem } from '#/order/domain/entities/order-item.entity';
import {
  OrderStatusError,
  OrderError,
} from '#/order/domain/errors/order.error';
import { OrderCreatedEvent } from '#/order/domain/events/order-created.event';
import { OrderPaidEvent } from '#/order/domain/events/order-paid.event';
import { OrderShippedEvent } from '#/order/domain/events/order-shipped.event';
import { OrderDeliveredEvent } from '#/order/domain/events/order-delivered.event';
import { OrderCancelledEvent } from '#/order/domain/events/order-cancelled.event';

export class Order extends AggregateRoot {
  private orderId: OrderId;
  private customerId: CustomerId;
  private items: OrderItem[];
  private status: OrderStatus;
  private shippingAddress: ShippingAddress;
  private discount?: Discount;
  private shippingFee: Money;
  private taxAmount: Money;
  private totalAmount: Money;
  private paidAt?: Date;
  private shippedAt?: Date;
  private deliveredAt?: Date;

  constructor(
    orderId: OrderId,
    customerId: CustomerId,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    shippingFee: Money,
    taxAmount: Money,
    totalAmount: Money,
    discount?: Discount,
  ) {
    super(orderId.getValue());
    this.orderId = orderId;
    this.customerId = customerId;
    this.items = items;
    this.status = OrderStatus.pending();
    this.shippingAddress = shippingAddress;
    this.discount = discount;
    this.shippingFee = shippingFee;
    this.taxAmount = taxAmount;
    this.totalAmount = totalAmount;

    this.addDomainEvent(new OrderCreatedEvent(orderId.getValue()));
  }

  getOrderId(): OrderId {
    return this.orderId;
  }

  getCustomerId(): CustomerId {
    return this.customerId;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getShippingAddress(): ShippingAddress {
    return this.shippingAddress;
  }

  getDiscount(): Discount | undefined {
    return this.discount;
  }

  getShippingFee(): Money {
    return this.shippingFee;
  }

  getTaxAmount(): Money {
    return this.taxAmount;
  }

  getTotalAmount(): Money {
    return this.totalAmount;
  }

  getPaidAt(): Date | undefined {
    return this.paidAt;
  }

  getShippedAt(): Date | undefined {
    return this.shippedAt;
  }

  getDeliveredAt(): Date | undefined {
    return this.deliveredAt;
  }

  markAsPaid(): void {
    if (!this.status.isPending()) {
      throw new OrderStatusError(
        `Cannot pay order with status ${this.status.toString()}`,
      );
    }

    this.status = OrderStatus.paid();
    this.paidAt = new Date();
    this.lockItems();

    this.addDomainEvent(new OrderPaidEvent(this.orderId.getValue()));
  }

  markAsShipped(): void {
    if (!this.status.isPaid()) {
      throw new OrderStatusError(
        'Can only ship paid orders. Current status: ' + this.status.toString(),
      );
    }

    this.status = OrderStatus.shipped();
    this.shippedAt = new Date();

    this.addDomainEvent(new OrderShippedEvent(this.orderId.getValue()));
  }

  markAsDelivered(): void {
    if (!this.status.isShipped()) {
      throw new OrderStatusError(
        'Can only deliver shipped orders. Current status: ' +
          this.status.toString(),
      );
    }

    this.status = OrderStatus.delivered();
    this.deliveredAt = new Date();

    this.addDomainEvent(new OrderDeliveredEvent(this.orderId.getValue()));
  }

  cancel(): void {
    if (this.status.isShipped() || this.status.isDelivered()) {
      throw new OrderStatusError(
        `Cannot cancel order with status ${this.status.toString()}`,
      );
    }

    this.status = OrderStatus.cancelled();

    this.addDomainEvent(new OrderCancelledEvent(this.orderId.getValue()));
  }

  private lockItems(): void {
    this.items.forEach((item) => item.lock());
  }

  addItem(item: OrderItem): void {
    if (!this.status.isPending()) {
      throw new OrderError('Can only add items to pending orders');
    }
    this.items.push(item);
  }

  equals(other: Order): boolean {
    return this.orderId.equals(other.orderId);
  }
}
