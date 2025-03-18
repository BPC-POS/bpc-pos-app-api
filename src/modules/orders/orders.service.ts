import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderItem, Product, ProductVariant } from '../../database/entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!createOrderDto.items || createOrderDto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOneBy({ id: item.product_id });
        if (!product) {
          throw new BadRequestException(`Product with ID ${item.product_id} not found`);
        }

        if (item.variant_id) {
          const variant = await this.productVariantRepository.findOneBy({ 
            id: item.variant_id,
            product_id: item.product_id 
          });
          
          if (!variant) {
            throw new BadRequestException(`Variant with ID ${item.variant_id} not found for product ${item.product_id}`);
          }
          
          if (variant.stock_quantity < item.quantity) {
            throw new BadRequestException(`Not enough stock for variant ${item.variant_id} of product ${item.product_id}`);
          }
          
          await queryRunner.manager.update(
            ProductVariant,
            { id: item.variant_id },
            { stock_quantity: () => `stock_quantity - ${item.quantity}` }
          );
        } else {
          if (product.stock_quantity < item.quantity) {
            throw new BadRequestException(`Not enough stock for product ${item.product_id}`);
          }
          
          await queryRunner.manager.update(
            Product,
            { id: item.product_id },
            { stock_quantity: () => `stock_quantity - ${item.quantity}` }
          );
        }
      }

      const order = queryRunner.manager.create(Order, {
        member_id: createOrderDto.member_id || null,
        user_id: createOrderDto.user_id || null,
        order_date: createOrderDto.order_date || new Date(),
        total_amount: createOrderDto.total_amount,
        discount: createOrderDto.discount || 0,
        tax: createOrderDto.tax || 0,
        status: createOrderDto.status || 1,
        payment_info: createOrderDto.payment_info,
        shipping_address: createOrderDto.shipping_address,
        meta: createOrderDto.meta,
      });

      const savedOrder = await queryRunner.manager.save(order);
      console.log(createOrderDto.items)
      const orderItems = createOrderDto.items.map(item => ({
        order_id: savedOrder.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        price: item.unit_price,
        discount: item.discount || 0,
        meta: item.meta,
      }));

      await queryRunner.manager.save(OrderItem, orderItems);
      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ['orderItems', 'orderItems.product'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
      });

      if (!order) {
        throw new NotFoundException(`Order #${id} not found`);
      }

      return order;
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

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order #${id} not found`);
      }

      const { items, ...orderData } = updateOrderDto;
      await queryRunner.manager.update(Order, id, orderData);

      if (items && items.length > 0) {
        await queryRunner.manager.delete(OrderItem, { order_id: id });

        for (const oldItem of existingOrder.orderItems) {
          if (oldItem.variant_id) {
            await queryRunner.manager.update(
              ProductVariant,
              { id: oldItem.variant_id },
              { stock_quantity: () => `stock_quantity + ${oldItem.quantity}` }
            );
          } else {
            await queryRunner.manager.update(
              Product,
              { id: oldItem.product_id },
              { stock_quantity: () => `stock_quantity + ${oldItem.quantity}` }
            );
          }
        }

        for (const item of items) {
          const product = await this.productRepository.findOneBy({ id: item.product_id });
          if (!product) {
            throw new BadRequestException(`Product with ID ${item.product_id} not found`);
          }

          if (item.variant_id) {
            const variant = await this.productVariantRepository.findOneBy({ 
              id: item.variant_id,
              product_id: item.product_id 
            });
            
            if (!variant) {
              throw new BadRequestException(`Variant with ID ${item.variant_id} not found for product ${item.product_id}`);
            }
            
            if (variant.stock_quantity < item.quantity) {
              throw new BadRequestException(`Not enough stock for variant ${item.variant_id} of product ${item.product_id}`);
            }
            
            await queryRunner.manager.update(
              ProductVariant,
              { id: item.variant_id },
              { stock_quantity: () => `stock_quantity - ${item.quantity}` }
            );
          } else {
            if (product.stock_quantity < item.quantity) {
              throw new BadRequestException(`Not enough stock for product ${item.product_id}`);
            }
            
            await queryRunner.manager.update(
              Product,
              { id: item.product_id },
              { stock_quantity: () => `stock_quantity - ${item.quantity}` }
            );
          }
        }

        const orderItems = items.map(item => this.orderItemRepository.create({
          order_id: id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount || 0,
          meta: item.meta,
        }));

        await queryRunner.manager.save(OrderItem, orderItems);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    } finally {
      await queryRunner.release();
    }
  }
}
