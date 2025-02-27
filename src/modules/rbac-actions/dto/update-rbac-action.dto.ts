import { PartialType } from '@nestjs/swagger';
import { CreateRbacActionDto } from './create-rbac-action.dto';

export class UpdateRbacActionDto extends PartialType(CreateRbacActionDto) {}
