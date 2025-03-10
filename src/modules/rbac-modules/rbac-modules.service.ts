import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRbacModuleDto } from './dto/create-rbac-module.dto';
import { UpdateRbacModuleDto } from './dto/update-rbac-module.dto';
import { RbacModule } from '../../database/entities';

@Injectable()
export class RbacModulesService {
  constructor(
    @InjectRepository(RbacModule)
    private rbacModuleRepository: Repository<RbacModule>,
  ) {}

  async create(createRbacModuleDto: CreateRbacModuleDto): Promise<RbacModule> {
    try {
      const rbacModule = this.rbacModuleRepository.create(createRbacModuleDto);
      return await this.rbacModuleRepository.save(rbacModule);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<RbacModule[]> {
    try {
      return await this.rbacModuleRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<RbacModule> {
    try {
      const rbacModule = await this.rbacModuleRepository.findOneBy({ id });
      if (!rbacModule) {
        throw new NotFoundException('RBAC Module not found');
      }
      return rbacModule;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateRbacModuleDto: UpdateRbacModuleDto): Promise<RbacModule> {
    try {
      await this.rbacModuleRepository.update(id, updateRbacModuleDto);
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
      const result = await this.rbacModuleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('RBAC Module not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
