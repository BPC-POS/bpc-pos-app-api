import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/index.dto';
import { Inventory, Product } from '../../database/entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    try {
      const { product_id, ...rest } = createInventoryDto;
      
      const product = await this.productRepository.findOneBy({ id: product_id });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const existingInventory = await this.inventoryRepository.findOneBy({ product: { id: product_id } as any });
      if (existingInventory) {
        throw new BadRequestException('Product already exists in the inventory');
      }

      const inventory = this.inventoryRepository.create({
        ...rest,
        product,
      });
      return await this.inventoryRepository.save(inventory);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findAll(): Promise<Inventory[]> {
    try {
      return await this.inventoryRepository.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Inventory> {
    try {
      const inventory = await this.inventoryRepository.findOneBy({ id });
      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }
      return inventory;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    try {
      await this.inventoryRepository.update(id, updateInventoryDto);
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
      const result = await this.inventoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Inventory not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }
}
