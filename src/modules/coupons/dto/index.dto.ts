import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, IsInt } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @ApiProperty({ example: 'Coupon Code' })
  code!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Coupon Description' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  discount_amount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  discount_percentage?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 100 })
  max_usage?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 0 })
  used_count?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @ApiProperty({ example: new Date().toISOString() })
  start_date?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @ApiProperty({ example: new Date().toISOString() })
  end_date?: Date;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1 })
  status?: number;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
