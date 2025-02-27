import { PartialType } from '@nestjs/swagger';
import { CreateRoleActionDto } from './create-role-action.dto';

export class UpdateRoleActionDto extends PartialType(CreateRoleActionDto) {}
