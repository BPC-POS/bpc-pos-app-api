import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem'+createOrderItemDto;
  }

  findAll() {
    return `This action returns all orderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`+updateOrderItemDto;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
