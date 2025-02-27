import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RbacModulesService } from './rbac-modules.service';
import { CreateRbacModuleDto } from './dto/create-rbac-module.dto';
import { UpdateRbacModuleDto } from './dto/update-rbac-module.dto';

@Controller('rbac-modules')
export class RbacModulesController {
  constructor(private readonly rbacModulesService: RbacModulesService) {}

  @Post()
  create(@Body() createRbacModuleDto: CreateRbacModuleDto) {
    return this.rbacModulesService.create(createRbacModuleDto);
  }

  @Get()
  findAll() {
    return this.rbacModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rbacModulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRbacModuleDto: UpdateRbacModuleDto) {
    return this.rbacModulesService.update(+id, updateRbacModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rbacModulesService.remove(+id);
  }
}
