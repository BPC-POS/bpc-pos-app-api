import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoyaltyPointsService } from './loyalty-points.service';
import { CreateLoyaltyPointDto } from './dto/create-loyalty-point.dto';
import { UpdateLoyaltyPointDto } from './dto/update-loyalty-point.dto';

@Controller('loyalty-points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Post()
  create(@Body() createLoyaltyPointDto: CreateLoyaltyPointDto) {
    return this.loyaltyPointsService.create(createLoyaltyPointDto);
  }

  @Get()
  findAll() {
    return this.loyaltyPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loyaltyPointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoyaltyPointDto: UpdateLoyaltyPointDto) {
    return this.loyaltyPointsService.update(+id, updateLoyaltyPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loyaltyPointsService.remove(+id);
  }
}
