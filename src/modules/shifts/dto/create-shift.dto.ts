import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShiftDto {
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Employee ID' })
  employee_id!: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2023-07-01T08:00:00Z', description: 'Shift start time' })
  start_time!: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2023-07-01T16:00:00Z', description: 'Shift end time' })
  end_time!: Date;

  @IsOptional()
  @ApiProperty({ example: {}, description: 'Additional metadata', required: false })
  meta?: any;
}
