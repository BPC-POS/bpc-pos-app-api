import { Injectable } from '@nestjs/common';
import { CreateRoleActionDto } from './dto/create-role-action.dto';
import { UpdateRoleActionDto } from './dto/update-role-action.dto';

@Injectable()
export class RoleActionsService {
  create(createRoleActionDto: CreateRoleActionDto) {
    return 'This action adds a new roleAction';
  }

  findAll() {
    return `This action returns all roleActions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleAction`;
  }

  update(id: number, updateRoleActionDto: UpdateRoleActionDto) {
    return `This action updates a #${id} roleAction`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleAction`;
  }
}
