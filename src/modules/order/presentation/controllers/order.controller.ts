import { Controller, Post, Get, Param, Body, HttpCode } from '@nestjs/common';
import { CreateOrderDto } from '#/order/application/dto/create-order.dto';
import { OrderResponseDto } from '#/order/application/dto/order-response.dto';
import { OrderMapper } from '#/order/application/mappers/order.mapper';
import { CreateOrderUseCase } from '#/order/application/use-cases/create-order.use-case';
import { PayOrderUseCase } from '#/order/application/use-cases/pay-order.use-case';
import { ShipOrderUseCase } from '#/order/application/use-cases/ship-order.use-case';
import { DeliverOrderUseCase } from '#/order/application/use-cases/deliver-order.use-case';
import { CancelOrderUseCase } from '#/order/application/use-cases/cancel-order.use-case';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly shipOrderUseCase: ShipOrderUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async createOrder(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.createOrderUseCase.execute(dto);
    return OrderMapper.toResponse(order);
  }

  @Post(':id/pay')
  @HttpCode(200)
  async payOrder(@Param('id') orderId: string): Promise<OrderResponseDto> {
    const order = await this.payOrderUseCase.execute(orderId);
    return OrderMapper.toResponse(order);
  }

  @Post(':id/ship')
  @HttpCode(200)
  async shipOrder(@Param('id') orderId: string): Promise<OrderResponseDto> {
    const order = await this.shipOrderUseCase.execute(orderId);
    return OrderMapper.toResponse(order);
  }

  @Post(':id/deliver')
  @HttpCode(200)
  async deliverOrder(@Param('id') orderId: string): Promise<OrderResponseDto> {
    const order = await this.deliverOrderUseCase.execute(orderId);
    return OrderMapper.toResponse(order);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  async cancelOrder(@Param('id') orderId: string): Promise<OrderResponseDto> {
    const order = await this.cancelOrderUseCase.execute(orderId);
    return OrderMapper.toResponse(order);
  }
}
