import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleActionDto } from './dto/create-role-action.dto';
import { UpdateRoleActionDto } from './dto/update-role-action.dto';
import { RoleAction } from '../../database/entities';

@Injectable()
export class RoleActionsService {
  constructor(
    @InjectRepository(RoleAction)
    private roleActionRepository: Repository<RoleAction>,
  ) {}

  async create(createRoleActionDto: CreateRoleActionDto): Promise<RoleAction> {
    try {
      const roleAction = this.roleActionRepository.create(createRoleActionDto);
      return await this.roleActionRepository.save(roleAction);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<RoleAction[]> {
    try {
      return await this.roleActionRepository.find({
        relations: ['role', 'action', 'action.module'],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<RoleAction> {
    try {
      const roleAction = await this.roleActionRepository.findOne({
        where: { id },
        relations: ['role', 'action', 'action.module'],
      });
      if (!roleAction) {
        throw new NotFoundException('Role Action not found');
      }
      return roleAction;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateRoleActionDto: UpdateRoleActionDto): Promise<RoleAction> {
    try {
      await this.roleActionRepository.update(id, updateRoleActionDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.roleActionRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Role Action not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
