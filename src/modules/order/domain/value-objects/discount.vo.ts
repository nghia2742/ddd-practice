import { Money } from '#/order/domain/value-objects/money.vo';
import { InvalidDiscountException } from '../exceptions/order.exception';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class Discount {
  private readonly type: string;
  private readonly value: number;

  constructor(type: string, value: number) {
    if (
      [
        DiscountType.FIXED.toString(),
        DiscountType.PERCENTAGE.toString(),
      ].indexOf(type) === -1
    ) {
      throw new InvalidDiscountException('Invalid discount type');
    }

    if (type === DiscountType.PERCENTAGE.toString()) {
      if (value < 0 || value > 50) {
        throw new InvalidDiscountException(
          'Discount percentage must be between 0 and 50',
        );
      }
    }
    if (value < 0) {
      throw new InvalidDiscountException('Discount value cannot be negative');
    }
    this.type = type;
    this.value = value;
  }

  getType(): string {
    return this.type;
  }

  getValue(): number {
    return this.value;
  }

  calculateDiscountAmount(subtotal: Money): Money {
    if (this.type === DiscountType.PERCENTAGE.toString()) {
      const discountAmount = subtotal.getAmount() * (this.value / 100);
      return new Money(discountAmount, subtotal.getCurrency());
    } else {
      const discountAmount = this.value;
      if (discountAmount > subtotal.getAmount()) {
        throw new InvalidDiscountException(
          'Fixed discount cannot exceed subtotal',
        );
      }
      return new Money(discountAmount, subtotal.getCurrency());
    }
  }

  equals(other: Discount): boolean {
    return this.type === other.type && this.value === other.value;
  }

  toString(): string {
    if (this.type === DiscountType.PERCENTAGE.toString()) {
      return `${this.value}%`;
    }
    return `${this.value} fixed`;
  }
}
