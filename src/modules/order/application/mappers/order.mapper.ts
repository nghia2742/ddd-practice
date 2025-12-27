import { Order } from '#/order/domain/aggregates/order.aggregate';
import { OrderResponseDto } from '#/order/application/dto/order-response.dto';

export class OrderMapper {
  static toPersistence(order: Order): any {
    return {
      id: order.getOrderId().getValue(),
      customerId: order.getCustomerId().getValue(),
      currency: order.getCurrency(),
      status: order.getStatus().getValue(),
      shippingAddress: {
        street: order.getShippingAddress().getStreet(),
        city: order.getShippingAddress().getCity(),
        country: order.getShippingAddress().getCountry(),
        postalCode: order.getShippingAddress().getPostalCode(),
      },
      shippingFee: order.getShippingFee().getAmount(),
      taxAmount: order.getTaxAmount().getAmount(),
      totalAmount: order.getTotalAmount().getAmount(),
      discount: order.getDiscount()
        ? {
            type: order.getDiscount()!.getType(),
            value: order.getDiscount()!.getValue(),
          }
        : null,
      createdAt: order.getCreatedAt(),
      paidAt: order.getPaidAt(),
      shippedAt: order.getShippedAt(),
      deliveredAt: order.getDeliveredAt(),
    };
  }

  static toResponse(order: Order): OrderResponseDto {
    return {
      id: order.getOrderId().getValue(),
      customerId: order.getCustomerId().getValue(),
      items: order.getItems().map((item) => ({
        id: item.getOrderItemId().getValue(),
        productId: item.getProductId().getValue(),
        price: item.getPrice().getAmount(),
        quantity: item.getQuantity().getValue(),
        total: item.getTotal().getAmount(),
      })),
      currency: order.getCurrency(),
      status: order.getStatus().getValue(),
      shippingAddress: {
        street: order.getShippingAddress().getStreet(),
        city: order.getShippingAddress().getCity(),
        country: order.getShippingAddress().getCountry(),
        postalCode: order.getShippingAddress().getPostalCode(),
      },
      shippingFee: order.getShippingFee().getAmount(),
      taxAmount: order.getTaxAmount().getAmount(),
      totalAmount: order.getTotalAmount().getAmount(),
      discount: order.getDiscount()
        ? {
            type: order.getDiscount()!.getType(),
            value: order.getDiscount()!.getValue(),
          }
        : undefined,
      createdAt: order.getCreatedAt(),
      paidAt: order.getPaidAt(),
      shippedAt: order.getShippedAt(),
      deliveredAt: order.getDeliveredAt(),
    };
  }
}
