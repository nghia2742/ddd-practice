import { v4 } from 'uuid';

export class UUIDUtil {
  static generate(): string {
    return v4() as string;
  }

  static validate(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
