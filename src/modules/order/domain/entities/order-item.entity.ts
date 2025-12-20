import { Money } from '#/order/domain/value-objects/money.vo';
import { OrderItemId } from '#/order/domain/value-objects/order-item-id.vo';
import { ProductId } from '#/order/domain/value-objects/product-id.vo';
import { Quantity } from '#/order/domain/value-objects/quantity.vo';
import { OrderItemError } from '#/order/domain/errors/order.error';

export class OrderItem {
  private readonly id: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private productId: ProductId;
  private price: Money;
  private quantity: Quantity;
  private isLocked: boolean = false;

  constructor(
    id: OrderItemId,
    productId: ProductId,
    price: Money,
    quantity: Quantity,
  ) {
    this.id = id.getValue();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
  }

  getId(): string {
    return this.id;
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
      throw new OrderItemError(
        'Cannot modify item quantity after order is locked',
      );
    }
    this.quantity = newQuantity;
    this.setUpdatedAt(new Date());
  }

  equals(other: OrderItem): boolean {
    return this.id === other.getId();
  }
}
