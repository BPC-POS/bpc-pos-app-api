/* eslint-disable */
// @ts-nocheck
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

      if (attributes && attributes.length > 0) {
        const attributeValues = [];
        
        for (const attr of attributes) {
          let existingAttribute = await this.productAttributeRepository.findOne({
            where: { id: attr.attribute_id }
          });
          
          if (!existingAttribute) {
            const newAttribute = this.productAttributeRepository.create({
              name: attr.value || `Attribute ${attr.attribute_id}`,
              status: 1
            });
            existingAttribute = await this.productAttributeRepository.save(newAttribute);
            attr.attribute_id = existingAttribute.id;
          }
          
          attributeValues.push({
            product_id: savedProduct.id,
            attribute_id: attr.attribute_id,
            value: attr.value,
          });
        }

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

  async findOne(id: number): Promise<any> {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const categories = await this.getProductCategories(id);
      const attributes = await this.getProductAttributes(id);
      const variants = await this.getProductVariants(id);

      return {
        ...product,
        categories,
        attributes,
        variants,
      };
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

  private async getProductCategories(productId: number): Promise<ProductCategory[]> {
    const categoryMappings = await this.productCategoryMappingRepository.find({
      where: { product_id: productId },
      relations: ['category'],
    });
    
    return categoryMappings.map(mapping => mapping.category)
      .filter(category => category !== null);
  }

  private async getProductAttributes(productId: number): Promise<any[]> {
    const attributeValues = await this.productAttributeValueRepository.find({
      where: { product_id: productId },
      relations: ['attribute'],
    });
    
    return attributeValues.map(av => ({
      id: av.attribute?.id,
      name: av.attribute?.name,
      value: av.value,
    }));
  }

  private async getProductVariants(productId: number): Promise<any[]> {
    const variants = await this.productVariantRepository.find({
      where: { product_id: productId },
    });
    
    const variantsWithAttributes = await Promise.all(variants.map(async variant => {
      const variantAttributes = await this.variantAttributeRepository.find({
        where: { variant_id: variant.id },
        relations: ['attribute'],
      });
      
      const attributes = variantAttributes.map(va => ({
        id: va.attribute?.id,
        name: va.attribute?.name,
        value: va.value,
      }));
      
      return {
        ...variant,
        attributes,
      };
    }));
    
    return variantsWithAttributes;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    const { categories, attributes, variants, ...productData } = updateProductDto;
    try {
      const existingProduct = await this.productsRepository.findOneBy({ id });
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      await this.productsRepository.update(id, productData);

      if (categories) {
        await this.productCategoryMappingRepository.delete({ product_id: id });
        
        if (categories.length > 0) {
          const existingCategories = await this.productCategoryRepository.findByIds(categories);
          if (existingCategories.length !== categories.length) {
            throw new BadRequestException('One or more categories do not exist');
          }

          const categoryMappings = categories.map(categoryId => ({
            product_id: id,
            category_id: categoryId,
          }));
          await this.productCategoryMappingRepository.save(categoryMappings);
        }
      }

      if (attributes) {
        await this.productAttributeValueRepository.delete({ product_id: id });
        
        if (attributes.length > 0) {
          const attributeValues = [];
          
          for (const attr of attributes) {
            let existingAttribute = await this.productAttributeRepository.findOne({
              where: { id: attr.attribute_id }
            });
            
            if (!existingAttribute) {
              const newAttribute = this.productAttributeRepository.create({
                name: attr.value || `Attribute ${attr.attribute_id}`,
                status: 1
              });
              existingAttribute = await this.productAttributeRepository.save(newAttribute);
              attr.attribute_id = existingAttribute.id;
            }
            
            attributeValues.push({
              product_id: id,
              attribute_id: attr.attribute_id,
              value: attr.value,
            });
          }

          if (attributeValues.length > 0) {
            await this.productAttributeValueRepository.save(attributeValues);
          }
        }
      }

      if (variants) {
        const existingVariants = await this.productVariantRepository.find({
          where: { product_id: id }
        });
        
        const existingVariantIds = existingVariants.map(v => v.id);
        const updatedVariantIds = variants
          .filter(v => v.id !== undefined)
          .map(v => v.id);
        
        const variantsToRemove = existingVariantIds.filter(
          id => !updatedVariantIds.includes(id)
        );
        
        if (variantsToRemove.length > 0) {
          await this.productVariantRepository.delete(variantsToRemove);
        }
        
        if (variants.length > 0) {
          for (const variant of variants) {
            const variantData = {
              ...variant,
              product_id: id,
            };
            
            let savedVariant;
            if (variant.id) {
              await this.productVariantRepository.update(variant.id, variantData);
              savedVariant = await this.productVariantRepository.findOneBy({ id: variant.id });
            } else {
              savedVariant = await this.productVariantRepository.save(variantData);
            }
            
            if (variant.attributes && variant.attributes.length > 0) {
              if (variant.id) {
                await this.variantAttributeRepository.delete({ variant_id: variant.id });
              }
              
              for (const attr of variant.attributes) {
                const existingAttribute = await this.productAttributeRepository.findOne({
                  where: [{ id: attr.attribute_id }]
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
      }

      return await this.findOne(id);
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
