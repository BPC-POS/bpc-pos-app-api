import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/index.dto';
import { Product, ProductCategoryMapping, ProductAttributeValue, ProductVariant, VariantAttribute, ProductCategory, ProductAttribute } from '../../database/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategoryMapping)
    private productCategoryMappingRepository: Repository<ProductCategoryMapping>,
    @InjectRepository(ProductAttributeValue)
    private productAttributeValueRepository: Repository<ProductAttributeValue>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categories, attributes, variants, ...productData } = createProductDto;
    try {
      const product = this.productsRepository.create(productData);
      const savedProduct = await this.productsRepository.save(product);

      // Save product categories
      if (categories && categories.length > 0) {
        const existingCategories = await this.productCategoryRepository.findByIds(categories);
        if (existingCategories.length !== categories.length) {
          throw new BadRequestException('One or more categories do not exist');
        }

        const categoryMappings = categories.map(categoryId => ({
          product_id: savedProduct.id,
          category_id: categoryId,
        }));
        await this.productCategoryMappingRepository.save(categoryMappings);
      }

      // Save product attributes
      if (attributes && attributes.length > 0) {
        const attributeValues = [];
        
        // For each attribute, ensure it exists in the database
        for (const attr of attributes) {
          // Check if attribute exists
          let existingAttribute = await this.productAttributeRepository.findOne({
            where: { id: attr.attribute_id }
          });
          
          // If it doesn't exist, create it
          if (!existingAttribute) {
            const newAttribute = this.productAttributeRepository.create({
              name: attr.value || `Attribute ${attr.attribute_id}`,
              status: 1
            });
            existingAttribute = await this.productAttributeRepository.save(newAttribute);
            // Update the attribute_id to use the newly created attribute's ID
            attr.attribute_id = existingAttribute.id;
          }
          
          // Add to attribute values array with guaranteed valid attribute_id
          attributeValues.push({
            product_id: savedProduct.id,
            attribute_id: attr.attribute_id,
            value: attr.value,
          });
        }

        // Save all attribute values with verified attribute IDs
        if (attributeValues.length > 0) {
          await this.productAttributeValueRepository.save(attributeValues);
        }
      }

      if (variants && variants.length > 0) {
        for (const variant of variants) {
          const variantData = {
            ...variant,
            product_id: savedProduct.id,
          };
          const savedVariant = await this.productVariantRepository.save(variantData);

          if (variant.attributes && variant.attributes.length > 0) {
            for (const attr of variant.attributes) {
              const existingAttribute = await this.productAttributeRepository.findOne({
                where: [
                  { id: attr.attribute_id }
                ]
              });
              
              if (!existingAttribute) {
                const newAttribute = this.productAttributeRepository.create({
                  name: attr.value || `Attribute ${attr.attribute_id}`,
                  status: 1
                });
                const savedAttribute = await this.productAttributeRepository.save(newAttribute);
                attr.attribute_id = savedAttribute.id;
              }
            }

            const variantAttributes = variant.attributes.map(attr => ({
              variant_id: savedVariant.id,
              attribute_id: attr.attribute_id,
              value: attr.value,
            }));
            await this.variantAttributeRepository.save(variantAttributes);
          }
        }
      }

      return savedProduct;
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
