import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductCategoryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: null, description: 'Parent category ID' })
  parent_id?: number;

  @IsString()
  @ApiProperty({ example: 'Coffee', description: 'Name of the category' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Category for Coffee', description: 'Description of the category' })
  description?: string;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'Status of the category' })
  status!: number;
}

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {}
