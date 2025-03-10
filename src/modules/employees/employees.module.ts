import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee, Member, Shift, Role } from '../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Member, Shift, Role])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
