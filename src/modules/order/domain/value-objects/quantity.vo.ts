import { InvalidQuantityException } from '../exceptions/order.exception';

export class Quantity {
  private readonly value: number;

  constructor(value: number) {
    if (value < 1) {
      throw new InvalidQuantityException('Quantity must be at least 1');
    }
    if (!Number.isInteger(value)) {
      throw new InvalidQuantityException('Quantity must be an integer');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    const result = this.value - other.value;
    if (result < 1) {
      throw new InvalidQuantityException(
        'Resulting quantity must be at least 1',
      );
    }
    return new Quantity(result);
  }

  multiply(multiplier: number): Quantity {
    if (multiplier < 1) {
      throw new InvalidQuantityException('Multiplier must be at least 1');
    }
    return new Quantity(Math.floor(this.value * multiplier));
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: Quantity): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Quantity): boolean {
    return this.value < other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
