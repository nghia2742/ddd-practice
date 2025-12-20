import { UUIDUtil } from '@/utils/uuid.util';

export class CustomerId {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      if (!UUIDUtil.validate(value)) {
        throw new Error('Invalid CustomerId format');
      }
      this.value = value;
    } else {
      this.value = UUIDUtil.generate();
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CustomerId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
