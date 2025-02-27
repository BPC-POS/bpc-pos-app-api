import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductCategoryMappingsService } from './product-category-mappings.service';
import { CreateProductCategoryMappingDto } from './dto/create-product-category-mapping.dto';
import { UpdateProductCategoryMappingDto } from './dto/update-product-category-mapping.dto';

@Controller('product-category-mappings')
export class ProductCategoryMappingsController {
  constructor(private readonly productCategoryMappingsService: ProductCategoryMappingsService) {}

  @Post()
  create(@Body() createProductCategoryMappingDto: CreateProductCategoryMappingDto) {
    return this.productCategoryMappingsService.create(createProductCategoryMappingDto);
  }

  @Get()
  findAll() {
    return this.productCategoryMappingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryMappingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCategoryMappingDto: UpdateProductCategoryMappingDto) {
    return this.productCategoryMappingsService.update(+id, updateProductCategoryMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryMappingsService.remove(+id);
  }
}
