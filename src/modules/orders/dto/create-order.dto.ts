import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Product ID' })
  product_id!: number;

  @IsNumber()
  @ApiProperty({ example: 2, description: 'Quantity of product' })
  quantity!: number;

  @IsNumber()
  @ApiProperty({ example: 100, description: 'Unit price of product' })
  unit_price!: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10, description: 'Discount amount for this item', required: false })
  discount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Variant ID if applicable', required: false })
  variant_id?: number;

  @IsOptional()
  @ApiProperty({ example: {}, description: 'Additional item metadata', required: false })
  meta?: any;
}

export class CreateOrderDto {
  @IsNumber()
  @IsOptional()
  // @ApiProperty({ example: 1, description: 'Customer ID' })
  member_id?: number;

  @IsOptional()
  @IsNumber()
  // @ApiProperty({ example: 1, description: 'User ID who created the order', required: false })
  user_id?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-10-31T12:00:00Z', description: 'Order date', required: false })
  order_date?: string;

  @IsNumber()
  @ApiProperty({ example: 200, description: 'Total amount of the order' })
  total_amount!: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 20, description: 'Discount amount for the order', required: false })
  discount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10, description: 'Tax amount for the order', required: false })
  tax?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Order status (1: pending, 2: processing, 3: completed, 4: canceled)', default: 1 })
  status?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Payment completed via credit card', description: 'Payment information', required: false })
  payment_info?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123 Main St, City', description: 'Shipping address', required: false })
  shipping_address?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({ type: [OrderItemDto], description: 'Order items' })
  items?: OrderItemDto[] = [];

  @IsOptional()
  @ApiProperty({ example: {}, description: 'Additional order metadata', required: false })
  meta?: any;
}
