import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table, TableArea } from '../../database/entities';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(TableArea)
    private tableAreaRepository: Repository<TableArea>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    try {
      const { area_id, ...tableData } = createTableDto;
      
      // Check if the table area exists
      const area = await this.tableAreaRepository.findOneBy({ id: area_id });
      if (!area) {
        throw new BadRequestException('Table area not found');
      }
      
      // Create and save the new table
      const table = this.tableRepository.create({
        ...tableData,
        area: area
      });
      
      return await this.tableRepository.save(table);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Table[]> {
    try {
      return await this.tableRepository.find({
        relations: ['area']
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Table> {
    try {
      const table = await this.tableRepository.findOne({
        where: { id },
        relations: ['area']
      });
      
      if (!table) {
        throw new NotFoundException('Table not found');
      }
      
      return table;
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

  async update(id: number, updateTableDto: UpdateTableDto): Promise<Table> {
    try {
      const existingTable = await this.tableRepository.findOneBy({ id });
      
      if (!existingTable) {
        throw new NotFoundException('Table not found');
      }
      
      const { area_id, ...tableData } = updateTableDto;
      
      // Update table data
      await this.tableRepository.update(id, tableData);
      
      // If area_id is provided, update the relation
      if (area_id !== undefined) {
        const area = await this.tableAreaRepository.findOneBy({ id: area_id });
        if (!area) {
          throw new BadRequestException('Table area not found');
        }
        
        existingTable.area = area;
        await this.tableRepository.save(existingTable);
      }
      
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
      const result = await this.tableRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException('Table not found');
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
