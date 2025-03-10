import { IsString, IsEmail, IsNumber } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Name of the employee' })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the employee' })
  email!: string;

  @IsString()
  @ApiProperty({ example: '123-456-7890', description: 'Phone number of the employee' })
  phone_number!: string;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'Role ID of the employee' })
  role_id!: number;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'Status of the employee' })
  status!: number;

  @IsNumber()
  @ApiProperty({ example: 123, description: 'Member ID of the employee' })
  member_id!: number;

  @ApiProperty({ example: [1, 2], description: 'Shifts of the employee' })
  shifts!: number[];
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
