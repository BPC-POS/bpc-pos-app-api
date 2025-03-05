import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLoyaltyPointDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  member_id!: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 100 })
  points!: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1000 })
  lifetime_points!: number;
}

export class UpdateLoyaltyPointDto extends PartialType(CreateLoyaltyPointDto) {}
