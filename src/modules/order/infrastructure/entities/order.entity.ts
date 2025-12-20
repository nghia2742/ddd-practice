import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemEntity } from '#/order/infrastructure/entities/order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  customerId: string;

  @Column('varchar', { length: 50 })
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingFee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discountPercentage: number | null;

  @Column('text')
  shippingAddressStreet: string;

  @Column('text')
  shippingAddressCity: string;

  @Column('text')
  shippingAddressCountry: string;

  @Column('text')
  shippingAddressZipCode: string;

  @Column('timestamp', { nullable: true })
  paidAt: Date | null;

  @Column('timestamp', { nullable: true })
  shippedAt: Date | null;

  @Column('timestamp', { nullable: true })
  deliveredAt: Date | null;

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
