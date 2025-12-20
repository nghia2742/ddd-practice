export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cod',
}

export interface IPaymentPolicy {
  isPaymentMethodAllowed(method: PaymentMethod): boolean;
  validatePayment(method: PaymentMethod): boolean;
}

export class PaymentPolicy implements IPaymentPolicy {
  private readonly allowedMethods = [
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.COD,
  ];

  isPaymentMethodAllowed(method: PaymentMethod): boolean {
    return this.allowedMethods.includes(method);
  }

  validatePayment(method: PaymentMethod): boolean {
    if (!this.isPaymentMethodAllowed(method)) {
      throw new Error(`Payment method ${method} is not allowed`);
    }
    return true;
  }
}
