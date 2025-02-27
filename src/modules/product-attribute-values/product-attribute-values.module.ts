import { Module } from '@nestjs/common';
import { ProductAttributeValuesService } from './product-attribute-values.service';
import { ProductAttributeValuesController } from './product-attribute-values.controller';

@Module({
  controllers: [ProductAttributeValuesController],
  providers: [ProductAttributeValuesService],
})
export class ProductAttributeValuesModule {}
