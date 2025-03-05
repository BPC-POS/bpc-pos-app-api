import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  @ApiProperty({ example: 2 })
  product_id!: number;

  @IsInt()
  @ApiProperty({ example: 100 })
  quantity!: number;

  @IsString()
  @ApiProperty({ example: 'addition' })
  adjustment_type!: string;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
