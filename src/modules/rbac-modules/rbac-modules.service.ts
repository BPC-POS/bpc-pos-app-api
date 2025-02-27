import { Injectable } from '@nestjs/common';
import { CreateRbacModuleDto } from './dto/create-rbac-module.dto';
import { UpdateRbacModuleDto } from './dto/update-rbac-module.dto';

@Injectable()
export class RbacModulesService {
  create(createRbacModuleDto: CreateRbacModuleDto) {
    return 'This action adds a new rbacModule';
  }

  findAll() {
    return `This action returns all rbacModules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rbacModule`;
  }

  update(id: number, updateRbacModuleDto: UpdateRbacModuleDto) {
    return `This action updates a #${id} rbacModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} rbacModule`;
  }
}
