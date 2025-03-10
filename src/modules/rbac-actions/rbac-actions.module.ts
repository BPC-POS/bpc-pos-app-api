import { Module } from '@nestjs/common';
import { RbacActionsService } from './rbac-actions.service';
import { RbacActionsController } from './rbac-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacAction } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RbacAction])],
  controllers: [RbacActionsController],
  providers: [RbacActionsService],
  exports: [RbacActionsService],
})
export class RbacActionsModule {}
