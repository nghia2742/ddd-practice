import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { OrderModule } from '#/order/order.module';
import { getDatabaseConfig } from './config/database.config';
import { BaseExceptionFilter, AllExceptionsFilter } from '@/filters';

@Module({
  imports: [TypeOrmModule.forRoot(getDatabaseConfig()), OrderModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
  ],
})
export class AppModule {}
