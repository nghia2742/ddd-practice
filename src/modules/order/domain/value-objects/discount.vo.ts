import { Money } from '#/order/domain/value-objects/money.vo';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export class Discount {
  private readonly type: DiscountType;
  private readonly value: number;

  constructor(type: DiscountType, value: number) {
    if (type === DiscountType.PERCENTAGE) {
      if (value < 0 || value > 50) {
        throw new Error('Discount percentage must be between 0 and 50');
      }
    }
    if (value < 0) {
      throw new Error('Discount value cannot be negative');
    }
    this.type = type;
    this.value = value;
  }

  getType(): DiscountType {
    return this.type;
  }

  getValue(): number {
    return this.value;
  }

  calculateDiscountAmount(subtotal: Money): Money {
    if (this.type === DiscountType.PERCENTAGE) {
      const discountAmount = subtotal.getAmount() * (this.value / 100);
      return new Money(discountAmount, subtotal.getCurrency());
    } else {
      const discountAmount = this.value;
      if (discountAmount > subtotal.getAmount()) {
        throw new Error('Fixed discount cannot exceed subtotal');
      }
      return new Money(discountAmount, subtotal.getCurrency());
    }
  }

  equals(other: Discount): boolean {
    return this.type === other.type && this.value === other.value;
  }

  toString(): string {
    if (this.type === DiscountType.PERCENTAGE) {
      return `${this.value}%`;
    }
    return `${this.value} fixed`;
  }
}
