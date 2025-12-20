import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OrderEntity } from '#/order/infrastructure/entities/order.entity';
import { OrderItemEntity } from '#/order/infrastructure/entities/order-item.entity';
import { StockEntity } from '#/order/infrastructure/entities/stock.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ddd_practice',
    entities: [OrderEntity, OrderItemEntity, StockEntity],
    synchronize:
      process.env.DB_SYNCHRONIZE === 'true' ||
      process.env.NODE_ENV === 'development',
    logging: process.env.DB_LOGGING === 'true',
    migrations: ['dist/src/migrations/**/*.js'],
    migrationsRun: process.env.NODE_ENV === 'production',
  };
};
