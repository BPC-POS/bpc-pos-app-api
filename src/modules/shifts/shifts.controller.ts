import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Shifts')
@ApiBearerAuth()
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  @ApiResponse({ status: 201, description: 'Shift has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiResponse({ status: 200, description: 'Return all shifts.' })
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by id' })
  @ApiResponse({ status: 200, description: 'Return the shift.' })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shift' })
  @ApiResponse({ status: 200, description: 'Shift has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftsService.update(+id, updateShiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shift' })
  @ApiResponse({ status: 200, description: 'Shift has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Shift not found.' })
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }
}
