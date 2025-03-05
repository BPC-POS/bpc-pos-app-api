import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

@Injectable()
export class PurchaseOrderItemsService {
  create(createPurchaseOrderItemDto: CreatePurchaseOrderItemDto) {
    return 'This action adds a new purchaseOrderItem'+ createPurchaseOrderItemDto;
  }

  findAll() {
    return `This action returns all purchaseOrderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderItem`;
  }

  update(id: number, updatePurchaseOrderItemDto: UpdatePurchaseOrderItemDto) {
    return `This action updates a #${id} ${updatePurchaseOrderItemDto}purchaseOrderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderItem`;
  }
}
