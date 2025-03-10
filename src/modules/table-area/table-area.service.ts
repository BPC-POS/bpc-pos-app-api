import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { UpdateTableAreaDto } from './dto/update-table-area.dto';
import { TableArea } from '../../database/entities';

@Injectable()
export class TableAreaService {
  constructor(
    @InjectRepository(TableArea)
    private tableAreaRepository: Repository<TableArea>,
  ) {}

  async create(createTableAreaDto: CreateTableAreaDto): Promise<TableArea> {
    try {
      const tableArea = this.tableAreaRepository.create(createTableAreaDto);
      return await this.tableAreaRepository.save(tableArea);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<TableArea[]> {
    try {
      return await this.tableAreaRepository.find({
        relations: ['tables']
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<TableArea> {
    try {
      const tableArea = await this.tableAreaRepository.findOne({
        where: { id },
        relations: ['tables']
      });
      
      if (!tableArea) {
        throw new NotFoundException('Table area not found');
      }
      
      return tableArea;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateTableAreaDto: UpdateTableAreaDto): Promise<TableArea> {
    try {
      const tableArea = await this.tableAreaRepository.findOneBy({ id });
      
      if (!tableArea) {
        throw new NotFoundException('Table area not found');
      }
      
      await this.tableAreaRepository.update(id, updateTableAreaDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.tableAreaRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException('Table area not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
