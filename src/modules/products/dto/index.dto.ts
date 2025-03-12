import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductAttributeDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  attribute_id!: number;

  @IsString()
  @ApiProperty({ example: 'Red' })
  value!: string;
}

class ProductVariantDto {
  @IsString()
  @ApiProperty({ example: 'SKU12345' })
  sku!: string;

  @IsNumber()
  @ApiProperty({ example: 100 })
  price!: number;

  @IsNumber()
  @ApiProperty({ example: 50 })
  stock_quantity!: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  status!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @ApiProperty({ type: [ProductAttributeDto], example: [{ attribute_id: 1, value: 'Red' }] })
  attributes?: ProductAttributeDto[];
}

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: 'Product Name' })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Product Description' })
  description?: string;

  @IsNumber()
  @ApiProperty({ example: 100 })
  price!: number;

  @IsNumber()
  @ApiProperty({ example: 50 })
  stock_quantity!: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'SKU12345' })
  sku?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  status?: number;

  @IsOptional()
  @ApiProperty({ example: {} })
  avatar?: any;

  @IsOptional()
  @ApiProperty({ example: {} })
  meta?: any;

  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [1], description: 'Category IDs' })
  categories?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @ApiProperty({ type: [ProductAttributeDto], example: [{ attribute_id: 1, value: 'Red' }] })
  attributes?: ProductAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @ApiProperty({ type: [ProductVariantDto], example: [{ sku: 'SKU12345', price: 100, stock_quantity: 50, status: 1, attributes: [{ attribute_id: 1, value: 'Red' }] }] })
  variants?: ProductVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
