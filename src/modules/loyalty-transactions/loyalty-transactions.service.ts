import { Injectable } from '@nestjs/common';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';
import { UpdateLoyaltyTransactionDto } from './dto/update-loyalty-transaction.dto';

@Injectable()
export class LoyaltyTransactionsService {
  create(createLoyaltyTransactionDto: CreateLoyaltyTransactionDto) {
    return 'This action adds a new loyaltyTransaction'+ createLoyaltyTransactionDto;
  }

  findAll() {
    return `This action returns all loyaltyTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loyaltyTransaction`;
  }

  update(id: number, updateLoyaltyTransactionDto: UpdateLoyaltyTransactionDto) {
    return `This action updates a #${id} loyaltyTransaction`+ updateLoyaltyTransactionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} loyaltyTransaction`;
  }
}
