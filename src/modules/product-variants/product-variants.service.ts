import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  create(createProductVariantDto: CreateProductVariantDto) {
    return 'This action adds a new productVariant'+ createProductVariantDto;
  }

  findAll() {
    return `This action returns all productVariants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    return `This action updates a #${id} productVariant`+ updateProductVariantDto;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariant`;
  }
}
