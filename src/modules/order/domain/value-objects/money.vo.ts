import { InvalidMoneyException } from '../exceptions/order.exception';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  VND = 'VND',
}

export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = Currency.USD) {
    if (amount < 0) {
      throw new InvalidMoneyException('Money amount cannot be negative');
    }

    if (!Object.values(Currency).includes(currency as Currency)) {
      throw new InvalidMoneyException(`Unsupported currency: ${currency}`);
    }

    this.amount = amount;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new InvalidMoneyException(
        'Cannot add money with different currencies',
      );
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new InvalidMoneyException(
        'Cannot subtract money with different currencies',
      );
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new InvalidMoneyException(
        'Cannot subtract resulting in negative money',
      );
    }
    return new Money(result, this.currency);
  }

  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new InvalidMoneyException('Multiplier cannot be negative');
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
