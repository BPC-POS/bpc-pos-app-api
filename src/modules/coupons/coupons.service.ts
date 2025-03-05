import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto, UpdateCouponDto } from './dto/index.dto';
import { Coupon } from '../../database/entities';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    try {
      const coupon = this.couponsRepository.create(createCouponDto);
      return await this.couponsRepository.save(coupon);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Coupon[]> {
    try {
      return await this.couponsRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Coupon> {
    try {
      const coupon = await this.couponsRepository.findOneBy({ id });
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      return coupon;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    try {
      await this.couponsRepository.update(id, updateCouponDto);
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
      const result = await this.couponsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Coupon not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
