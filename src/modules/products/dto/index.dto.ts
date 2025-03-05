import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

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
  meta?: any;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
