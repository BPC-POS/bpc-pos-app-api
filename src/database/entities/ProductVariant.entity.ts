import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import { Product, VariantAttribute, OrderItem } from './index';

@Entity({ name: 'product_variants' })
export class ProductVariant extends CustomBaseEntity {
    @Column()
    product_id!: number;

    @Column()
    sku!: string;

    @Column('decimal')
    price!: number;

    @Column()
    stock_quantity!: number;

    @Column()
    status!: number;

    @Column('jsonb', { nullable: true })
    meta!: any;

    @ManyToOne(() => Product, product => product.productVariants)
    product!: Relation<Product>;

    @OneToMany(() => VariantAttribute, variantAttribute => variantAttribute.variant)
    variantAttributes!: Relation<VariantAttribute>[];

    @OneToMany(() => OrderItem, orderItem => orderItem.variant)
    orderItems!: Relation<OrderItem>[];
}