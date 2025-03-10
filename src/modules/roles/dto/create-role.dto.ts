import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ example: 'Admin' })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Administrator role with full access' })
  description?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [1, 2, 3], description: 'IDs of actions assigned to this role', required: false })
  roleActionIds?: number[];

  @IsNumber()
  @ApiProperty({ example: 1, description: '1 for active, 0 for inactive' })
  status!: number;

  @IsOptional()
  @ApiProperty({ example: {}, description: 'Additional metadata for the role' })
  meta?: object;
}
