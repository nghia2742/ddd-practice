import { Injectable, Inject } from '@nestjs/common';
import type { IOrderRepository } from '#/order/domain/repositories/order.repository';
import type { IStockDomainService } from '#/order/domain/services/stock.domain-service';
import { CreateOrderDto } from '#/order/application/dto/create-order.dto';
import { Order } from '#/order/domain/aggregates/order.aggregate';
import { OrderId } from '#/order/domain/value-objects/order-id.vo';
import { CustomerId } from '#/order/domain/value-objects/customer-id.vo';
import { OrderItem } from '#/order/domain/entities/order-item.entity';
import { Money, Currency } from '#/order/domain/value-objects/money.vo';
import { Quantity } from '#/order/domain/value-objects/quantity.vo';
import { ProductId } from '#/order/domain/value-objects/product-id.vo';
import { ShippingAddress } from '#/order/domain/value-objects/address.vo';
import {
  Discount,
  DiscountType,
} from '#/order/domain/value-objects/discount.vo';
import {
  PricingDomainService,
  IPricingDomainService,
} from '#/order/domain/services/pricing.domain-service';
import { UUIDUtil } from '@/utils/uuid.util';
import { OrderItemId } from '#/order/domain/value-objects/order-item-id.vo';

@Injectable()
export class CreateOrderUseCase {
  private readonly pricingService: IPricingDomainService;

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IStockDomainService')
    private readonly stockService: IStockDomainService,
  ) {
    this.pricingService = new PricingDomainService();
  }

  async execute(dto: CreateOrderDto): Promise<Order> {
    // Validate and create value objects
    const orderId = new OrderId();
    const customerId = new CustomerId(dto.customerId);
    const shippingAddress = new ShippingAddress(
      dto.shippingAddress.street,
      dto.shippingAddress.city,
      dto.shippingAddress.country,
      dto.shippingAddress.postalCode,
    );
    const currency = dto.currency;

    // Create order items
    const items: OrderItem[] = [];
    for (const itemDto of dto.items) {
      const id = new OrderItemId(UUIDUtil.generate());
      const productId = new ProductId(itemDto.productId);
      const quantity = new Quantity(itemDto.quantity);

      // Check stock
      await this.stockService.checkStock(productId, quantity);

      const price = new Money(itemDto.price, currency);
      const item = new OrderItem(id, productId, price, quantity);
      items.push(item);
    }

    // Calculate pricing
    const subtotal = this.pricingService.calculateSubtotal(items);

    let discount: Discount | undefined;
    if (dto.discount) {
      discount = new Discount(dto.discount.type, dto.discount.value);
    }

    const taxAmount = this.pricingService.calculateTax(subtotal);
    const discountAmount = this.pricingService.calculateDiscount(
      discount,
      subtotal,
    );

    const shippingFee = new Money(dto.shippingFee, currency);
    const totalAmount = this.pricingService.calculateTotal(
      subtotal,
      shippingFee,
      taxAmount,
      discountAmount,
    );

    // Create order aggregate
    const order = new Order(
      orderId,
      customerId,
      items,
      currency,
      shippingAddress,
      shippingFee,
      taxAmount,
      totalAmount,
      discount,
    );

    // Save order
    await this.orderRepository.save(order);

    return order;
  }
}
