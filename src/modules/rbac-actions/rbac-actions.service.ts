import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRbacActionDto } from './dto/create-rbac-action.dto';
import { UpdateRbacActionDto } from './dto/update-rbac-action.dto';
import { RbacAction } from '../../database/entities';

@Injectable()
export class RbacActionsService {
  constructor(
    @InjectRepository(RbacAction)
    private rbacActionRepository: Repository<RbacAction>,
  ) {}

  async create(createRbacActionDto: CreateRbacActionDto): Promise<RbacAction> {
    try {
      const rbacAction = this.rbacActionRepository.create(createRbacActionDto);
      return await this.rbacActionRepository.save(rbacAction);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<RbacAction[]> {
    try {
      return await this.rbacActionRepository.find({
        relations: ['module'],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<RbacAction> {
    try {
      const rbacAction = await this.rbacActionRepository.findOne({
        where: { id },
        relations: ['module'],
      });
      if (!rbacAction) {
        throw new NotFoundException('RBAC Action not found');
      }
      return rbacAction;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateRbacActionDto: UpdateRbacActionDto): Promise<RbacAction> {
    try {
      await this.rbacActionRepository.update(id, updateRbacActionDto);
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
      const result = await this.rbacActionRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('RBAC Action not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
