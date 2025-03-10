import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @ApiProperty({ example: 'Bàn 1' })
  name!: string;

  @IsNumber()
  @ApiProperty({ example: 4 })
  capacity!: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Near window', required: false })
  notes?: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  status!: number;


  @IsNumber()
  @ApiProperty({ example: 1 })
  area_id!: number;
}
