import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateRbacModuleDto {
  @IsString()
  @ApiProperty({ example: 'users' })
  name!: string;
  
  @IsString()
  @ApiProperty({ example: 'USER' })
  key!: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'User management module' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: '1 for active, 0 for inactive' })
  status?: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: {}, type: 'object' })
  meta?: object;
}
