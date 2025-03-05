import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoyaltyPointDto, UpdateLoyaltyPointDto } from './dto/index.dto';
import { LoyaltyPoint, Member } from '../../database/entities';

@Injectable()
export class LoyaltyPointsService {
  constructor(
    @InjectRepository(LoyaltyPoint)
    private loyaltyPointsRepository: Repository<LoyaltyPoint>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(createLoyaltyPointDto: CreateLoyaltyPointDto): Promise<LoyaltyPoint> {
    try {
      const { member_id, ...rest } = createLoyaltyPointDto;
      
      const member = await this.memberRepository.findOneBy({ id: member_id });
      if (!member) {
        throw new NotFoundException('Member not found');
      }
      const loyaltyPoint = this.loyaltyPointsRepository.create({
        ...rest,
        member,
      });
      return await this.loyaltyPointsRepository.save(loyaltyPoint);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<LoyaltyPoint[]> {
    try {
      return await this.loyaltyPointsRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<LoyaltyPoint> {
    try {
      const loyaltyPoint = await this.loyaltyPointsRepository.findOneBy({ id });
      if (!loyaltyPoint) {
        throw new NotFoundException('LoyaltyPoint not found');
      }
      return loyaltyPoint;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateLoyaltyPointDto: UpdateLoyaltyPointDto): Promise<LoyaltyPoint> {
    try {
      await this.loyaltyPointsRepository.update(id, updateLoyaltyPointDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.loyaltyPointsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('LoyaltyPoint not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
