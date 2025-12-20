import { Order } from '#/order/domain/aggregates/order.aggregate';
import { OrderEntity } from '#/order/infrastructure/entities/order.entity';
import { OrderItemEntity } from '#/order/infrastructure/entities/order-item.entity';
import { OrderId } from '#/order/domain/value-objects/order-id.vo';
import { CustomerId } from '#/order/domain/value-objects/customer-id.vo';
import { Money, Currency } from '#/order/domain/value-objects/money.vo';
import { ShippingAddress } from '#/order/domain/value-objects/address.vo';
import { OrderStatusVO } from '#/order/domain/value-objects/order-status.vo';
import { OrderItem } from '#/order/domain/entities/order-item.entity';
import { ProductId } from '#/order/domain/value-objects/product-id.vo';
import { Quantity } from '#/order/domain/value-objects/quantity.vo';
import {
  Discount,
  DiscountType,
} from '#/order/domain/value-objects/discount.vo';
import { OrderItemId } from '#/order/domain/value-objects/order-item-id.vo';

export class OrderMapper {
  static toPersistence(domainOrder: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = domainOrder.getOrderId().getValue();
    entity.customerId = domainOrder.getCustomerId().getValue();
    entity.status = domainOrder.getStatus().getValue() as string;
    entity.totalAmount = Number(domainOrder.getTotalAmount().getAmount());
    entity.shippingFee = Number(domainOrder.getShippingFee().getAmount());
    entity.taxAmount = Number(domainOrder.getTaxAmount().getAmount());

    const address = domainOrder.getShippingAddress();
    entity.shippingAddressStreet = address.getStreet();
    entity.shippingAddressCity = address.getCity();
    entity.shippingAddressZipCode = address.getPostalCode();
    entity.shippingAddressCountry = address.getCountry();

    if (domainOrder.getDiscount()) {
      const discount = domainOrder.getDiscount();
      entity.discountPercentage =
        discount!.getType() === DiscountType.PERCENTAGE
          ? Number(discount!.getValue())
          : null;
    } else {
      entity.discountPercentage = null;
    }

    entity.paidAt = domainOrder.getPaidAt() || null;
    entity.shippedAt = domainOrder.getShippedAt() || null;
    entity.deliveredAt = domainOrder.getDeliveredAt() || null;

    entity.items = domainOrder.getItems().map((item) => {
      const itemEntity = new OrderItemEntity();
      itemEntity.id = item.getId();
      itemEntity.orderId = entity.id;
      itemEntity.productId = item.getProductId().getValue();
      itemEntity.price = Number(item.getPrice().getAmount());
      itemEntity.quantity = item.getQuantity().getValue();
      itemEntity.isLocked = item.isItemLocked();
      return itemEntity;
    });

    return entity;
  }

  static toDomain(persistenceEntity: OrderEntity): Order {
    const items = (persistenceEntity.items || []).map((itemEntity) => {
      return new OrderItem(
        new OrderItemId(itemEntity.id),
        new ProductId(itemEntity.productId),
        new Money(Number(itemEntity.price), Currency.USD),
        new Quantity(itemEntity.quantity),
      );
    });

    const shippingAddress = new ShippingAddress(
      persistenceEntity.shippingAddressStreet,
      persistenceEntity.shippingAddressCity,
      persistenceEntity.shippingAddressCountry,
      persistenceEntity.shippingAddressZipCode,
    );

    let discount: Discount | undefined;
    if (persistenceEntity.discountPercentage) {
      discount = new Discount(
        DiscountType.PERCENTAGE,
        Number(persistenceEntity.discountPercentage),
      );
    }

    const orderAggregate = new Order(
      new OrderId(persistenceEntity.id),
      new CustomerId(persistenceEntity.customerId),
      items,
      shippingAddress,
      new Money(Number(persistenceEntity.shippingFee), Currency.USD),
      new Money(Number(persistenceEntity.taxAmount), Currency.USD),
      new Money(Number(persistenceEntity.totalAmount), Currency.USD),
      discount,
    );

    // Restore persisted state without triggering domain events
    const aggregateAny = orderAggregate as unknown as Record<string, any>;

    // Only set status if it's different from the default 'pending'
    if (persistenceEntity.status !== 'pending') {
      const statusMap: Record<string, OrderStatusVO> = {
        pending: OrderStatusVO.pending(),
        paid: OrderStatusVO.paid(),
        shipped: OrderStatusVO.shipped(),
        delivered: OrderStatusVO.delivered(),
        cancelled: OrderStatusVO.cancelled(),
      };
      aggregateAny.status =
        statusMap[persistenceEntity.status] || OrderStatusVO.pending();
    }

    // Restore timestamps
    if (persistenceEntity.paidAt) {
      aggregateAny.paidAt = persistenceEntity.paidAt;
    }
    if (persistenceEntity.shippedAt) {
      aggregateAny.shippedAt = persistenceEntity.shippedAt;
    }
    if (persistenceEntity.deliveredAt) {
      aggregateAny.deliveredAt = persistenceEntity.deliveredAt;
    }

    // Lock items if they were locked in the database
    items.forEach((item, index) => {
      const itemData = persistenceEntity.items[index];
      if (itemData && itemData.isLocked) {
        (item as unknown as Record<string, any>).isLocked = true;
      }
    });

    // Clear domain events since this is a loaded aggregate, not a new one
    aggregateAny.clearDomainEvents();

    return orderAggregate;
  }
}
