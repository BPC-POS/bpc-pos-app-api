import { Module } from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributesController } from './product-attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  ProductAttribute,
  ProductAttributeValue,
  ProductCategory,
  ProductCategoryMapping,
  ProductVariant,
  VariantAttribute,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategoryMapping,
      ProductAttributeValue,
      ProductVariant,
      VariantAttribute,
      ProductCategory,
      ProductAttribute,
    ]),
  ],
  controllers: [ProductAttributesController],
  providers: [ProductAttributesService],
})
export class ProductAttributesModule {}
