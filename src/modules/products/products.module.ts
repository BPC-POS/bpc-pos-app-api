import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategoryMapping, ProductAttributeValue, ProductVariant, VariantAttribute, ProductCategory, ProductAttribute } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategoryMapping, ProductAttributeValue, ProductVariant, VariantAttribute, ProductCategory, ProductAttribute])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
