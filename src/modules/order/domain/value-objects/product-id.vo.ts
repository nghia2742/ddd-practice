export class ProductId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
