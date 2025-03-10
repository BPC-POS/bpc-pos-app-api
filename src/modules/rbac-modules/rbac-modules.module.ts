import { Module } from '@nestjs/common';
import { RbacModulesService } from './rbac-modules.service';
import { RbacModulesController } from './rbac-modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacModule } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RbacModule])],
  controllers: [RbacModulesController],
  providers: [RbacModulesService],
  exports: [RbacModulesService],
})
export class RbacModulesModule {}
