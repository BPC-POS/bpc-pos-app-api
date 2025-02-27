import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RbacActionsService } from './rbac-actions.service';
import { CreateRbacActionDto } from './dto/create-rbac-action.dto';
import { UpdateRbacActionDto } from './dto/update-rbac-action.dto';

@Controller('rbac-actions')
export class RbacActionsController {
  constructor(private readonly rbacActionsService: RbacActionsService) {}

  @Post()
  create(@Body() createRbacActionDto: CreateRbacActionDto) {
    return this.rbacActionsService.create(createRbacActionDto);
  }

  @Get()
  findAll() {
    return this.rbacActionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rbacActionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRbacActionDto: UpdateRbacActionDto) {
    return this.rbacActionsService.update(+id, updateRbacActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rbacActionsService.remove(+id);
  }
}
