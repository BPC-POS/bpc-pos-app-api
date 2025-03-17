import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import { Order, Product, ReturnItem, ProductVariant } from './index';

@Entity({ name: 'order_items' })
export class OrderItem extends CustomBaseEntity {
    @Column()
    order_id!: number;

    @Column()
    product_id!: number;

    @Column({ nullable: true })
    variant_id!: number | null;

    @Column()
    quantity!: number;

    @Column()
    price!: number;

    @Column()
    unit_price!: number;

    @Column('decimal', { nullable: true }) // Add this column
    discount!: number | null; // Add this property

    @Column('jsonb', { nullable: true })
    meta!: any;

    @ManyToOne(() => Order, order => order.orderItems)
    order!: Relation<Order>;

    @ManyToOne(() => Product, product => product.orderItems)
    product!: Relation<Product>;

    @ManyToOne(() => ProductVariant, variant => variant.orderItems, { nullable: true })
    variant!: Relation<ProductVariant> | null;

    @OneToMany(() => ReturnItem, returnItem => returnItem.orderItem)
    returnItems!: Relation<ReturnItem>[];
}