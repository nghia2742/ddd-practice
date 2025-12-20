import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEntity } from '../entities/stock.entity';
import {
  Stock,
  IStockRepository,
} from '#/order/domain/repositories/stock.repository';
import { ProductId } from '#/order/domain/value-objects/product-id.vo';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TypeOrmStockRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockEntity)
    private readonly repository: Repository<StockEntity>,
  ) {}

  async findById(id: string): Promise<Stock | null> {
    const stockEntity = await this.repository.findOne({
      where: { id },
    });

    if (!stockEntity) {
      return null;
    }

    return {
      productId: stockEntity.productId,
      quantity: stockEntity.quantity,
    };
  }

  async findByProductId(productId: ProductId): Promise<Stock | null> {
    const stockEntity = await this.repository.findOne({
      where: { productId: productId.getValue() },
    });

    if (!stockEntity) {
      return null;
    }

    return {
      productId: stockEntity.productId,
      quantity: stockEntity.quantity,
    };
  }

  async save(entity: Stock): Promise<void> {
    const existingStock = await this.repository.findOne({
      where: { productId: entity.productId },
    });

    if (existingStock) {
      existingStock.quantity = entity.quantity;
      await this.repository.save(existingStock);
    } else {
      const newStock = new StockEntity();
      newStock.id = uuidv4();
      newStock.productId = entity.productId;
      newStock.quantity = entity.quantity;
      await this.repository.save(newStock);
    }
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
