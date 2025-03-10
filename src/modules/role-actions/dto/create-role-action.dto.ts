import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateRoleActionDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  role_id!: number;

  @IsNumber()
  @ApiProperty({ example: 4 })
  rbac_action_id!: number;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'Status of the role action' })
  status!: number;

  @IsObject()
  @IsOptional()
  @ApiProperty({ 
    example: {}, 
    description: 'Additional metadata for the role action',
    required: false 
  })
  meta?: object;
}
