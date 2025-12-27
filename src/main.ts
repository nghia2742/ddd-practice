import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║         DDD Practice - Order Module with TypeORM         ║
╚══════════════════════════════════════════════════════════╝
🗄️  Database Configuration:
   NODE_ENV=${process.env.NODE_ENV || 'development'}

📝 Available Endpoints:
   POST   /orders              - Create order
   POST   /orders/:id/pay      - Pay order
   POST   /orders/:id/ship     - Ship order
   POST   /orders/:id/deliver  - Deliver order
   POST   /orders/:id/cancel   - Cancel order

Application is running on: http://localhost:${process.env.PORT ?? 3000}
    `);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
