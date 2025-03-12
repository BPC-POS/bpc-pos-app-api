import { Entity, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import {
  ProductTax,
  Inventory,
  OrderItem,
  ProductCategoryMapping,
  ProductTag,
  ProductAttributeValue,
  ProductVariant,
  PurchaseOrderItem,
} from './index';

@Entity({ name: 'products' })
export class Product extends CustomBaseEntity {
  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal')
  price!: number;

  @Column()
  sku!: string;

  @Column()
  stock_quantity!: number;

  @Column()
  status!: number;

  @Column('jsonb', { nullable: true })
  avatar!: Record<string, any>;

  @Column('jsonb', { nullable: true })
  meta!: any;

  @OneToMany(() => ProductTax, (productTax) => productTax.product)
  productTaxes!: Relation<ProductTax>[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory!: Relation<Inventory>[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: Relation<OrderItem>[];

  @OneToMany(() => ProductCategoryMapping, (mapping) => mapping.product)
  productCategoryMappings!: Relation<ProductCategoryMapping>[];

  @OneToMany(() => ProductTag, (productTag) => productTag.product)
  productTags!: Relation<ProductTag>[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  productAttributeValues!: Relation<ProductAttributeValue>[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  productVariants!: Relation<ProductVariant>[];

  @OneToMany(
    () => PurchaseOrderItem,
    (purchaseOrderItem) => purchaseOrderItem.product,
  )
  purchaseOrderItems!: Relation<PurchaseOrderItem>[];
}
