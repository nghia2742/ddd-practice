import { Repository } from '@/kernel/repository.interface';
import { Order } from '../aggregates/order.aggregate';

export interface IOrderRepository extends Repository<Order> {
  findById(id: string): Promise<Order | null>;
  save(entity: Order): Promise<void>;
  delete(id: string): Promise<void>;
}
