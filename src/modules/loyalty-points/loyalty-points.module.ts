import { Module } from '@nestjs/common';
import { LoyaltyPointsService } from './loyalty-points.service';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPoint, Member } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyPoint, Member])],
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
