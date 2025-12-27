import { InvalidAddressException } from '../exceptions/order.exception';

const SUPPORTED_COUNTRIES = [
  'US',
  'UK',
  'DE',
  'FR',
  'ES',
  'IT',
  'CA',
  'AU',
  'VN',
];

const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  ES: /^\d{5}$/,
  IT: /^\d{5}$/,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  AU: /^\d{4}$/,
  VN: /^\d{6}$/,
};

export class ShippingAddress {
  private readonly street: string;
  private readonly city: string;
  private readonly country: string;
  private readonly postalCode: string;

  constructor(
    street: string,
    city: string,
    country: string,
    postalCode: string,
  ) {
    this.validateCountry(country);
    this.validatePostalCode(country, postalCode);

    this.street = street;
    this.city = city;
    this.country = country;
    this.postalCode = postalCode;
  }

  private validateCountry(country: string): void {
    if (!SUPPORTED_COUNTRIES.includes(country.toUpperCase())) {
      throw new InvalidAddressException(
        `Country ${country} is not supported. Supported countries: ${SUPPORTED_COUNTRIES.join(', ')}`,
      );
    }
  }

  private validatePostalCode(country: string, postalCode: string): void {
    const pattern = POSTAL_CODE_PATTERNS[country.toUpperCase()];
    if (!pattern || !pattern.test(postalCode)) {
      throw new InvalidAddressException(
        `Invalid postal code for ${country}: ${postalCode}`,
      );
    }
  }

  getStreet(): string {
    return this.street;
  }

  getCity(): string {
    return this.city;
  }

  getCountry(): string {
    return this.country;
  }

  getPostalCode(): string {
    return this.postalCode;
  }

  equals(other: ShippingAddress): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.country === other.country &&
      this.postalCode === other.postalCode
    );
  }

  toString(): string {
    return `${this.street}, ${this.city}, ${this.country} ${this.postalCode}`;
  }
}
