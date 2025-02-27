import { Injectable } from '@nestjs/common';
import { CreateLoyaltyPointDto } from './dto/create-loyalty-point.dto';
import { UpdateLoyaltyPointDto } from './dto/update-loyalty-point.dto';

@Injectable()
export class LoyaltyPointsService {
  create(createLoyaltyPointDto: CreateLoyaltyPointDto) {
    return 'This action adds a new loyaltyPoint';
  }

  findAll() {
    return `This action returns all loyaltyPoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loyaltyPoint`;
  }

  update(id: number, updateLoyaltyPointDto: UpdateLoyaltyPointDto) {
    return `This action updates a #${id} loyaltyPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} loyaltyPoint`;
  }
}
