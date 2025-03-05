import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto/index.dto';
import { ProductCategory } from '../../database/entities';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    try {
      const productCategory = this.productCategoriesRepository.create(createProductCategoryDto);
      return await this.productCategoriesRepository.save(productCategory);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<ProductCategory[]> {
    try {
      return await this.productCategoriesRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<ProductCategory> {
    try {
      const productCategory = await this.productCategoriesRepository.findOneBy({ id });
      if (!productCategory) {
        throw new NotFoundException('ProductCategory not found');
      }
      return productCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    try {
      await this.productCategoriesRepository.update(id, updateProductCategoryDto);
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
      const result = await this.productCategoriesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('ProductCategory not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
