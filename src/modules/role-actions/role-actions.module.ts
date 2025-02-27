import { Module } from '@nestjs/common';
import { RoleActionsService } from './role-actions.service';
import { RoleActionsController } from './role-actions.controller';

@Module({
  controllers: [RoleActionsController],
  providers: [RoleActionsService],
})
export class RoleActionsModule {}
