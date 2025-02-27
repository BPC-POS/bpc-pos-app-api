import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoyaltyTransactionsService } from './loyalty-transactions.service';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';
import { UpdateLoyaltyTransactionDto } from './dto/update-loyalty-transaction.dto';

@Controller('loyalty-transactions')
export class LoyaltyTransactionsController {
  constructor(private readonly loyaltyTransactionsService: LoyaltyTransactionsService) {}

  @Post()
  create(@Body() createLoyaltyTransactionDto: CreateLoyaltyTransactionDto) {
    return this.loyaltyTransactionsService.create(createLoyaltyTransactionDto);
  }

  @Get()
  findAll() {
    return this.loyaltyTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loyaltyTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoyaltyTransactionDto: UpdateLoyaltyTransactionDto) {
    return this.loyaltyTransactionsService.update(+id, updateLoyaltyTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loyaltyTransactionsService.remove(+id);
  }
}
