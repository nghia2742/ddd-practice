import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { Order } from '#/order/domain/aggregates/order.aggregate';
import { IOrderRepository } from '#/order/domain/repositories/order.repository';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class TypeOrmOrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const orderEntity = await this.repository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!orderEntity) {
      return null;
    }

    return OrderMapper.toDomain(orderEntity);
  }

  async save(entity: Order): Promise<void> {
    const persistenceEntity = OrderMapper.toPersistence(entity);

    await this.repository.save(persistenceEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
