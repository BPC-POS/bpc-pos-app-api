import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRbacActionDto {
  @IsString()
  @ApiProperty({ example: 'create user' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'CREATE_USER' })
  key!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Create operation' })
  description?: string;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID of the related RbacModule' })
  rbac_module_id!: number; 

  @IsString()
  @ApiProperty({ example: 'POST' })
  method!: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: '1 for active, 0 for inactive' })
  status?: number;

  @IsOptional()
  @ApiProperty({ example: {} })
  meta?: any;
}
