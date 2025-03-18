import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import { Role, PurchaseOrder, Order } from './index';

@Entity({ name: 'users' })
export class User extends CustomBaseEntity {
  @Column({ nullable: true })
  avatar!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone_number!: string;

  @Column({ nullable: true })
  gender!: number;

  @Column({ type: 'timestamp', nullable: true })
  day_of_birth!: Date;

  @Column({ nullable: true })
  token!: string;

  @Column()
  name!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: 1 })
  status!: number;

  @Column({ name: 'id_role', nullable: true })
  id_role!: number;

  @Column({ nullable: true })
  firebase_token!: string;

  @Column({ type: 'jsonb', nullable: true })
  first_login!: any;

  @Column({ type: 'jsonb', nullable: true })
  meta!: any;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.createdBy)
  purchaseOrders!: PurchaseOrder[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Relation<Order>[];
}
