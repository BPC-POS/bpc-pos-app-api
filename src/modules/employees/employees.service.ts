import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/index.dto';
import { Employee, Role, Shift, Member } from '../../database/entities';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const { role_id, shifts, member_id, ...employeeData } = createEmployeeDto;
      let role: Role | null = null;
      if (role_id) {
        role = await this.rolesRepository.findOneBy({ id: role_id });
        if (!role) {
          throw new NotFoundException('Role not found');
        }
      }

      const member = await this.membersRepository.findOneBy({ id: member_id });
      if (!member) {
        throw new NotFoundException('Member not found');
      }

      const employee = this.employeesRepository.create({
        ...employeeData,
        ...(role ? { role } : {}),
        member,
      });

      if (shifts && shifts.length > 0) {
        employee.shifts = await this.shiftsRepository.findBy({
          id: In(shifts),
        });
      }

      return await this.employeesRepository.save(employee);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeesRepository.find({
        relations: ['role', 'shifts', 'member'],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Employee> {
    try {
      const employee = await this.employeesRepository.findOne({
        where: { id },
        relations: ['role', 'shifts', 'member'],
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return employee;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const { role_id, shifts, member_id, ...employeeData } = updateEmployeeDto;

      const employee = await this.findOne(id);

      if (role_id) {
        const role = await this.rolesRepository.findOneBy({ id: role_id });
        if (!role) {
          throw new NotFoundException('Role not found');
        }
        employee.role = role;
      }

      if (member_id) {
        const member = await this.membersRepository.findOneBy({
          id: member_id,
        });
        if (!member) {
          throw new NotFoundException('Member not found');
        }
        employee.member = member;
      }

      if (shifts && shifts.length > 0) {
        employee.shifts = await this.shiftsRepository.findBy({
          id: In(shifts),
        });
      }

      Object.assign(employee, employeeData);

      return await this.employeesRepository.save(employee);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.employeesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Employee not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
