import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '#/order/presentation/controllers/order.controller';
import { CreateOrderUseCase } from '#/order/application/use-cases/create-order.use-case';
import { PayOrderUseCase } from '#/order/application/use-cases/pay-order.use-case';
import { ShipOrderUseCase } from '#/order/application/use-cases/ship-order.use-case';
import { CancelOrderUseCase } from '#/order/application/use-cases/cancel-order.use-case';
import { DeliverOrderUseCase } from '#/order/application/use-cases/deliver-order.use-case';
import { PricingDomainService } from '#/order/domain/services/pricing.domain-service';
import { StockDomainService } from '#/order/domain/services/stock.domain-service';
import { PaymentPolicy } from '#/order/domain/policies/payment.policy';
import { OrderEntity } from '#/order/infrastructure/entities/order.entity';
import { OrderItemEntity } from '#/order/infrastructure/entities/order-item.entity';
import { StockEntity } from '#/order/infrastructure/entities/stock.entity';
import { TypeOrmOrderRepository } from '#/order/infrastructure/repositories/order.repository';
import { TypeOrmStockRepository } from '#/order/infrastructure/repositories/stock.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, StockEntity]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    PayOrderUseCase,
    ShipOrderUseCase,
    CancelOrderUseCase,
    DeliverOrderUseCase,
    PricingDomainService,
    StockDomainService,
    PaymentPolicy,
    {
      provide: 'IOrderRepository',
      useClass: TypeOrmOrderRepository,
    },
    {
      provide: 'IStockService',
      useClass: StockDomainService,
    },
    {
      provide: 'IStockRepository',
      useClass: TypeOrmStockRepository,
    },
  ],
})
export class OrderModule {}
