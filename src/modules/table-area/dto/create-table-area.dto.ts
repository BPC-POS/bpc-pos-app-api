import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTableAreaDto {
  @IsString()
  @ApiProperty({ example: 'Trong nhà', description: 'The name of the table area' })
  name!: string;
}
