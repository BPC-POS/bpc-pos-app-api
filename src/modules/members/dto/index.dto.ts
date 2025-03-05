import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @ApiProperty({ example: 'example@example.com' })
  email!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '0788779029' })
  phone_number?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  gender?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @ApiProperty({ example: '1990-01-01' })
  day_of_birth?: Date;

  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @IsString()
  @ApiProperty({ example: '123456aA@' })
  password!: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  status?: number;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
