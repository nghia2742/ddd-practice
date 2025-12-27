import { Money } from '#/order/domain/value-objects/money.vo';
import { OrderItemId } from '#/order/domain/value-objects/order-item-id.vo';
import { ProductId } from '#/order/domain/value-objects/product-id.vo';
import { Quantity } from '#/order/domain/value-objects/quantity.vo';
import { OrderDomainException } from '#/order/domain/exceptions/order.exception';

export class OrderItem {
  private orderItemId: OrderItemId;
  private createdAt: Date;
  private updatedAt: Date;
  private productId: ProductId;
  private price: Money;
  private quantity: Quantity;
  private isLocked: boolean = false;

  constructor(
    orderItemId: OrderItemId,
    productId: ProductId,
    price: Money,
    quantity: Quantity,
  ) {
    this.orderItemId = orderItemId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
  }

  getOrderItemId(): OrderItemId {
    return this.orderItemId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  getProductId(): ProductId {
    return this.productId;
  }

  getPrice(): Money {
    return this.price;
  }

  getQuantity(): Quantity {
    return this.quantity;
  }

  getTotal(): Money {
    return this.price.multiply(this.quantity.getValue());
  }

  lock(): void {
    this.isLocked = true;
  }

  isItemLocked(): boolean {
    return this.isLocked;
  }

  canModify(): boolean {
    return !this.isLocked;
  }

  modifyQuantity(newQuantity: Quantity): void {
    if (!this.canModify()) {
      throw new OrderDomainException(
        'Cannot modify item quantity after order is locked',
        'CANNOT_MODIFY_LOCKED_ITEM',
      );
    }
    this.quantity = newQuantity;
    this.setUpdatedAt(new Date());
  }

  equals(other: OrderItem): boolean {
    return this.orderItemId === other.getOrderItemId();
  }
}
