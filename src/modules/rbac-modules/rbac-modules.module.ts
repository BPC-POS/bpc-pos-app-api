import { Module } from '@nestjs/common';
import { RbacModulesService } from './rbac-modules.service';
import { RbacModulesController } from './rbac-modules.controller';

@Module({
  controllers: [RbacModulesController],
  providers: [RbacModulesService],
})
export class RbacModulesModule {}
