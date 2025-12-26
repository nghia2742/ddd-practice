import { Money } from '#/order/domain/value-objects/money.vo';
import { OrderItem } from '#/order/domain/entities/order-item.entity';
import { Discount } from '#/order/domain/value-objects/discount.vo';

export interface IPricingDomainService {
  calculateSubtotal(items: OrderItem[]): Money;
  calculateTax(subtotal: Money): Money;
  calculateDiscount(discount: Discount | undefined, subtotal: Money): Money;
  calculateTotal(
    subtotal: Money,
    shippingFee: Money,
    tax: Money,
    discount: Money,
  ): Money;
}

// The implementation is defined here because this is PURE implementation
export class PricingDomainService implements IPricingDomainService {
  private readonly TAX_RATE = 0.1; // 10%
  private readonly DISCOUNT_MIN_SUBTOTAL = 500;

  calculateSubtotal(items: OrderItem[]): Money {
    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    let subtotal = items[0].getTotal();
    for (let i = 1; i < items.length; i++) {
      subtotal = subtotal.add(items[i].getTotal());
    }
    return subtotal;
  }

  calculateTax(subtotal: Money): Money {
    return subtotal.multiply(this.TAX_RATE);
  }

  calculateDiscount(discount: Discount | undefined, subtotal: Money): Money {
    if (!discount) {
      return new Money(0, subtotal.getCurrency());
    }

    if (subtotal.getAmount() < this.DISCOUNT_MIN_SUBTOTAL) {
      throw new Error(
        `Discount only applies when subtotal is at least ${this.DISCOUNT_MIN_SUBTOTAL}`,
      );
    }

    return discount.calculateDiscountAmount(subtotal);
  }

  calculateTotal(
    subtotal: Money,
    shippingFee: Money,
    tax: Money,
    discount: Money,
  ): Money {
    let total = subtotal;
    total = total.add(shippingFee);
    total = total.add(tax);
    total = total.subtract(discount);
    return total;
  }
}
