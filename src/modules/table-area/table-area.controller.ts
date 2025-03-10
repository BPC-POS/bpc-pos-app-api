import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableAreaService } from './table-area.service';
import { CreateTableAreaDto, UpdateTableAreaDto } from './dto/index.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Table Areas')
@ApiBearerAuth()
@Controller('table-area')
export class TableAreaController {
  constructor(private readonly tableAreaService: TableAreaService) {}

  @Post()
  create(@Body() createTableAreaDto: CreateTableAreaDto) {
    return this.tableAreaService.create(createTableAreaDto);
  }

  @Get()
  findAll() {
    return this.tableAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableAreaDto: UpdateTableAreaDto) {
    return this.tableAreaService.update(+id, updateTableAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableAreaService.remove(+id);
  }
}
