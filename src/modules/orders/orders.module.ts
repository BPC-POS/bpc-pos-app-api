import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem, Product, ProductVariant } from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, ProductVariant]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
