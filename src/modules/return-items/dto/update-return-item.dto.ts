import { PartialType } from '@nestjs/swagger';
import { CreateReturnItemDto } from './create-return-item.dto';

export class UpdateReturnItemDto extends PartialType(CreateReturnItemDto) {}
