import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/index.dto';
import { Discount } from '../../database/entities';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    try {
      const discount = this.discountsRepository.create(createDiscountDto);
      return await this.discountsRepository.save(discount);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Discount[]> {
    try {
      return await this.discountsRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Discount> {
    try {
      const discount = await this.discountsRepository.findOneBy({ id });
      if (!discount) {
        throw new NotFoundException('Discount not found');
      }
      return discount;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    try {
      await this.discountsRepository.update(id, updateDiscountDto);
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
      const result = await this.discountsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Discount not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
