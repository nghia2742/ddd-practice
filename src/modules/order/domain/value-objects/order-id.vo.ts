import { UUIDUtil } from '@/utils/uuid.util';

export class OrderId {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      if (!UUIDUtil.validate(value)) {
        throw new Error('Invalid OrderId format');
      }
      this.value = value;
    } else {
      this.value = UUIDUtil.generate();
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrderId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
