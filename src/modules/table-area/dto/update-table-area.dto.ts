import { PartialType } from '@nestjs/swagger';
import { CreateTableAreaDto } from './create-table-area.dto';

export class UpdateTableAreaDto extends PartialType(CreateTableAreaDto) {}
