import { Module } from '@nestjs/common';
import { ProductTaxesService } from './product-taxes.service';
import { ProductTaxesController } from './product-taxes.controller';

@Module({
  controllers: [ProductTaxesController],
  providers: [ProductTaxesService],
})
export class ProductTaxesModule {}
