import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @ApiProperty({ example: 'DISCOUNT2023' })
  code!: string;

  @IsString()
  @ApiProperty({ example: 'Spring Sale Discount' })
  description!: string;

  @IsNumber()
  @ApiProperty({ example: 20 })
  discount_percentage!: number;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @ApiProperty({ example: new Date().toISOString() })
  start_date!: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @ApiProperty({ example: new Date().toISOString() })
  end_date?: Date;

  @IsNumber()
  @ApiProperty({ example: 1 })
  status!: number;
}

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
