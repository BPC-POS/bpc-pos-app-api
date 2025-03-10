import { Module } from '@nestjs/common';
import { RoleActionsService } from './role-actions.service';
import { RoleActionsController } from './role-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleAction } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RoleAction])],
  controllers: [RoleActionsController],
  providers: [RoleActionsService],
  exports: [RoleActionsService],
})
export class RoleActionsModule {}
