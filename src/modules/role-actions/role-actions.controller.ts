import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleActionsService } from './role-actions.service';
import { CreateRoleActionDto } from './dto/create-role-action.dto';
import { UpdateRoleActionDto } from './dto/update-role-action.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Role Actions')
@ApiBearerAuth()
@Controller('role-actions')
export class RoleActionsController {
  constructor(private readonly roleActionsService: RoleActionsService) {}

  @Post()
  create(@Body() createRoleActionDto: CreateRoleActionDto) {
    return this.roleActionsService.create(createRoleActionDto);
  }

  @Get()
  findAll() {
    return this.roleActionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleActionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleActionDto: UpdateRoleActionDto) {
    return this.roleActionsService.update(+id, updateRoleActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleActionsService.remove(+id);
  }
}
