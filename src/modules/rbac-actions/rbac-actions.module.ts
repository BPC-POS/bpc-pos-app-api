import { Module } from '@nestjs/common';
import { RbacActionsService } from './rbac-actions.service';
import { RbacActionsController } from './rbac-actions.controller';

@Module({
  controllers: [RbacActionsController],
  providers: [RbacActionsService],
})
export class RbacActionsModule {}
