import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto } from './dto/index.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Product Attributes')
@ApiBearerAuth()
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(private readonly productAttributesService: ProductAttributesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product attribute' })
  @ApiResponse({ status: 201, description: 'The product attribute has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributesService.create(createProductAttributeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({ status: 200, description: 'Return all product attributes.' })
  findAll() {
    return this.productAttributesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product attribute by id' })
  @ApiResponse({ status: 200, description: 'Return the product attribute.' })
  @ApiResponse({ status: 404, description: 'Product attribute not found.' })
  findOne(@Param('id') id: string) {
    return this.productAttributesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product attribute' })
  @ApiResponse({ status: 200, description: 'The product attribute has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product attribute not found.' })
  update(@Param('id') id: string, @Body() updateProductAttributeDto: UpdateProductAttributeDto) {
    return this.productAttributesService.update(+id, updateProductAttributeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product attribute' })
  @ApiResponse({ status: 200, description: 'The product attribute has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product attribute not found.' })
  remove(@Param('id') id: string) {
    return this.productAttributesService.remove(+id);
  }
}
