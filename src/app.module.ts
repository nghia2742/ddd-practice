import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '#/order/order.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(getDatabaseConfig()), OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
