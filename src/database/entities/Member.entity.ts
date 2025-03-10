import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import {
  Order,
  LoyaltyPoint,
  LoyaltyTransaction,
  MediaFile,
  ThirdPartyLog,
  Return,
  Employee,
} from './index';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'members' })
export class Member extends CustomBaseEntity {
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

  @Column({ type: 'jsonb', nullable: true })
  first_login!: any;

  @Column({ type: 'jsonb', nullable: true })
  meta!: any;

  @OneToMany(() => Order, (order) => order.member)
  orders!: Relation<Order>[];

  @OneToMany(() => LoyaltyPoint, (loyaltyPoint) => loyaltyPoint.member)
  loyaltyPoints!: Relation<LoyaltyPoint>[];

  @OneToMany(
    () => LoyaltyTransaction,
    (loyaltyTransaction) => loyaltyTransaction.member,
  )
  loyaltyTransactions!: Relation<LoyaltyTransaction>[];

  @OneToMany(() => MediaFile, (mediaFile) => mediaFile.member)
  mediaFiles!: Relation<MediaFile>[];

  @OneToMany(() => ThirdPartyLog, (thirdPartyLog) => thirdPartyLog.member)
  thirdPartyLogs!: Relation<ThirdPartyLog>[];

  @OneToMany(() => Return, (returnEntity) => returnEntity.member)
  returns!: Relation<Return>[];

  @OneToMany(() => Employee, (employee) => employee.member)
  employees!: Relation<Employee>[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
