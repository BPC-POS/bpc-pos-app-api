import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { ProductAttribute } from '../../database/entities';

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
  ) {}

  async create(createProductAttributeDto: CreateProductAttributeDto): Promise<ProductAttribute> {
    try {
      const attribute = this.productAttributeRepository.create({
        ...createProductAttributeDto,
        status: createProductAttributeDto.status ?? 1,
      });
      
      return await this.productAttributeRepository.save(attribute);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<ProductAttribute[]> {
    try {
      return await this.productAttributeRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<ProductAttribute> {
    try {
      const attribute = await this.productAttributeRepository.findOneBy({ id });
      if (!attribute) {
        throw new NotFoundException('Product attribute not found');
      }
      return attribute;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateProductAttributeDto: UpdateProductAttributeDto): Promise<ProductAttribute> {
    try {
      const attribute = await this.productAttributeRepository.findOneBy({ id });
      if (!attribute) {
        throw new NotFoundException('Product attribute not found');
      }

      await this.productAttributeRepository.update(id, updateProductAttributeDto);
      const updatedAttribute = await this.productAttributeRepository.findOneBy({ id });
      if (!updatedAttribute) {
        throw new NotFoundException('Product attribute not found after update');
      }
      return updatedAttribute;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.productAttributeRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Product attribute not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
