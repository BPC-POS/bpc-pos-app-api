import { Injectable } from '@nestjs/common';
import { CreateProductTaxDto } from './dto/create-product-tax.dto';
import { UpdateProductTaxDto } from './dto/update-product-tax.dto';

@Injectable()
export class ProductTaxesService {
  create(createProductTaxDto: CreateProductTaxDto) {
    return 'This action adds a new productTax';
  }

  findAll() {
    return `This action returns all productTaxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productTax`;
  }

  update(id: number, updateProductTaxDto: UpdateProductTaxDto) {
    return `This action updates a #${id} productTax`;
  }

  remove(id: number) {
    return `This action removes a #${id} productTax`;
  }
}
