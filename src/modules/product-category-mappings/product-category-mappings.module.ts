import { Module } from '@nestjs/common';
import { ProductCategoryMappingsService } from './product-category-mappings.service';
import { ProductCategoryMappingsController } from './product-category-mappings.controller';

@Module({
  controllers: [ProductCategoryMappingsController],
  providers: [ProductCategoryMappingsService],
})
export class ProductCategoryMappingsModule {}
