import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  @ApiProperty({ example: 'Color', description: 'The name of the product attribute' })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Product color options', description: 'Description of the attribute', required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'Status of the attribute (1: active, 0: inactive)', default: 1 })
  status?: number;

  @IsOptional()
  @ApiProperty({ example: {}, description: 'Additional metadata', required: false })
  meta?: any;
}
