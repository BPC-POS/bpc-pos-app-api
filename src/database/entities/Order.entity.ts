import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import {
  Member,
  OrderItem,
  Payment,
  LoyaltyTransaction,
  Return,
  User,
} from './index';

@Entity({ name: 'orders' })
export class Order extends CustomBaseEntity {
  @Column({ nullable: true })
  member_id!: number | null;

  @Column({ nullable: true })
  user_id!: number | null;

  @Column('decimal')
  total_amount!: number;

  @Column()
  status!: number;

  @Column('jsonb', { nullable: true })
  meta!: any;

  @ManyToOne(() => Member, (member) => member.orders)
  member!: Relation<Member>;

  @ManyToOne(() => User, (User) => User.orders)
  user!: Relation<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: Relation<OrderItem>[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Relation<Payment>[];

  @OneToMany(
    () => LoyaltyTransaction,
    (loyaltyTransaction) => loyaltyTransaction.order,
  )
  loyaltyTransactions!: Relation<LoyaltyTransaction>[];

  @OneToMany(() => Return, (returnEntity) => returnEntity.order)
  returns!: Relation<Return>[];
}
