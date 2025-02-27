import { PartialType } from '@nestjs/swagger';
import { CreateRbacModuleDto } from './create-rbac-module.dto';

export class UpdateRbacModuleDto extends PartialType(CreateRbacModuleDto) {}
