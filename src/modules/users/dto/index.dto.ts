import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '0788779029' })
  phone_number?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  gender?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2004-09-03' })
  day_of_birth?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '-' })
  token?: string;

  @IsString()
  @ApiProperty({ example: 'Admin' })
  name!: string;

  @IsString()
  @ApiProperty({ example: '123456a@' })
  password!: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  status?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 2 })
  id_role?: number;

  @IsOptional()
  @IsString()
  firebase_token?: string;

  @IsOptional()
  @IsBoolean()
  first_login?: any;

  @IsOptional()
  meta?: any;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
