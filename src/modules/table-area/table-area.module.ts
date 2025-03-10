import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableAreaService } from './table-area.service';
import { TableAreaController } from './table-area.controller';
import { TableArea } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TableArea])],
  controllers: [TableAreaController],
  providers: [TableAreaService],
  exports: [TableAreaService],
})
export class TableAreaModule {}
