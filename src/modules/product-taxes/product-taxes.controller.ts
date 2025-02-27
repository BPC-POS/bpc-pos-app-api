import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTaxesService } from './product-taxes.service';
import { CreateProductTaxDto } from './dto/create-product-tax.dto';
import { UpdateProductTaxDto } from './dto/update-product-tax.dto';

@Controller('product-taxes')
export class ProductTaxesController {
  constructor(private readonly productTaxesService: ProductTaxesService) {}

  @Post()
  create(@Body() createProductTaxDto: CreateProductTaxDto) {
    return this.productTaxesService.create(createProductTaxDto);
  }

  @Get()
  findAll() {
    return this.productTaxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTaxesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductTaxDto: UpdateProductTaxDto) {
    return this.productTaxesService.update(+id, updateProductTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTaxesService.remove(+id);
  }
}
