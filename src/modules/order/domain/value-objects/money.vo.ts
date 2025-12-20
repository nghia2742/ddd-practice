export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export class Money {
  private readonly amount: number;
  private readonly currency: Currency;

  constructor(amount: number, currency: Currency = Currency.USD) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this.amount = amount;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Cannot subtract resulting in negative money');
    }
    return new Money(result, this.currency);
  }

  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error('Multiplier cannot be negative');
    }
    return new Money(this.amount * multiplier, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < other.amount;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}
