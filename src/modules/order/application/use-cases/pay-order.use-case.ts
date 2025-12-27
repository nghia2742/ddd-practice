import { Injectable, Inject } from '@nestjs/common';
import type { IOrderRepository } from '#/order/domain/repositories/order.repository';
import { Order } from '#/order/domain/aggregates/order.aggregate';
import { OrderId } from '#/order/domain/value-objects/order-id.vo';
import { OrderNotFoundException } from '#/order/application/exceptions/order.application-exception';

@Injectable()
export class PayOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: string): Promise<Order> {
    const id = new OrderId(orderId);
    const order = await this.orderRepository.findById(id.getValue());

    if (!order) {
      throw new OrderNotFoundException(orderId);
    }

    order.markAsPaid();
    await this.orderRepository.save(order);

    return order;
  }
}
