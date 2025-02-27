import { Injectable } from '@nestjs/common';
import { CreateProductCategoryMappingDto } from './dto/create-product-category-mapping.dto';
import { UpdateProductCategoryMappingDto } from './dto/update-product-category-mapping.dto';

@Injectable()
export class ProductCategoryMappingsService {
  create(createProductCategoryMappingDto: CreateProductCategoryMappingDto) {
    return 'This action adds a new productCategoryMapping';
  }

  findAll() {
    return `This action returns all productCategoryMappings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategoryMapping`;
  }

  update(id: number, updateProductCategoryMappingDto: UpdateProductCategoryMappingDto) {
    return `This action updates a #${id} productCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategoryMapping`;
  }
}
