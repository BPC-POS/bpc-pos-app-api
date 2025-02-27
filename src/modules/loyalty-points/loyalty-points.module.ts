import { Module } from '@nestjs/common';
import { LoyaltyPointsService } from './loyalty-points.service';
import { LoyaltyPointsController } from './loyalty-points.controller';

@Module({
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
