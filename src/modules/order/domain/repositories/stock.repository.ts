import { Repository } from '@/kernel/repository.interface';
import { ProductId } from '../value-objects/product-id.vo';

export interface Stock {
  productId: string;
  quantity: number;
}

export interface IStockRepository extends Repository<Stock> {
  findByProductId(productId: ProductId): Promise<Stock | null>;
  save(entity: Stock): Promise<void>;
  delete(id: string): Promise<void>;
}
