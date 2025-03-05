import { Injectable } from '@nestjs/common';
import { CreateRbacActionDto } from './dto/create-rbac-action.dto';
import { UpdateRbacActionDto } from './dto/update-rbac-action.dto';

@Injectable()
export class RbacActionsService {
  create(createRbacActionDto: CreateRbacActionDto) {
    return 'This action adds a new rbacAction'+ createRbacActionDto;
  }

  findAll() {
    return `This action returns all rbacActions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rbacAction`;
  }

  update(id: number, updateRbacActionDto: UpdateRbacActionDto) {
    return `This action updates a #${id} rbacAction`+updateRbacActionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} rbacAction`;
  }
}
