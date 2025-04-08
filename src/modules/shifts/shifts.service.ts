import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift, Employee } from '../../database/entities';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    try {
      const employee = await this.employeeRepository.findOneBy({ 
        id: createShiftDto.employee_id 
      });
      
      if (!employee) {
        throw new BadRequestException(`Employee with ID ${createShiftDto.employee_id} not found`);
      }
      
      if (new Date(createShiftDto.start_time) >= new Date(createShiftDto.end_time)) {
        throw new BadRequestException('Start time must be before end time');
      }
      
      const shift = this.shiftRepository.create(createShiftDto);
      return await this.shiftRepository.save(shift);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Shift[]> {
    try {
      return await this.shiftRepository.find({
        relations: ['employee']
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Shift> {
    try {
      const shift = await this.shiftRepository.findOne({
        where: { id },
        relations: ['employee']
      });
      
      if (!shift) {
        throw new NotFoundException(`Shift with ID ${id} not found`);
      }
      
      return shift;
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

  async update(id: number, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    try {
      const shift = await this.shiftRepository.findOneBy({ id });
      if (!shift) {
        throw new NotFoundException(`Shift with ID ${id} not found`);
      }

      // If employee_id is updated, check if the new employee exists
      if (updateShiftDto.employee_id) {
        const employee = await this.employeeRepository.findOneBy({ 
          id: updateShiftDto.employee_id 
        });
        
        if (!employee) {
          throw new BadRequestException(`Employee with ID ${updateShiftDto.employee_id} not found`);
        }
      }

      if (updateShiftDto.start_time && updateShiftDto.end_time) {
        if (new Date(updateShiftDto.start_time) >= new Date(updateShiftDto.end_time)) {
          throw new BadRequestException('Start time must be before end time');
        }
      } else if (updateShiftDto.start_time && shift.end_time) {
        if (new Date(updateShiftDto.start_time) >= new Date(shift.end_time)) {
          throw new BadRequestException('Start time must be before end time');
        }
      } else if (updateShiftDto.end_time && shift.start_time) {
        if (new Date(shift.start_time) >= new Date(updateShiftDto.end_time)) {
          throw new BadRequestException('Start time must be before end time');
        }
      }

      await this.shiftRepository.update(id, updateShiftDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
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
      const result = await this.shiftRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Shift with ID ${id} not found`);
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
