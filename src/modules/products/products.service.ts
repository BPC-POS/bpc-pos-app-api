import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/index.dto';
import { Product } from '../../database/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productsRepository.create(createProductDto);
      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productsRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      await this.productsRepository.update(id, updateProductDto);
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
      const result = await this.productsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Product not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
