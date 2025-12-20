import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  orderId: string;

  @Column('varchar', { length: 36 })
  productId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('boolean', { default: false })
  isLocked: boolean;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
