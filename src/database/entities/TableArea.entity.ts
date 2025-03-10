import { Entity, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import { Table } from './Table.entity';

@Entity({ name: 'table_areas' })
export class TableArea extends CustomBaseEntity {
  @Column()
  name!: string;

  @OneToMany(() => Table, (table) => table.area)
  tables!: Relation<Table>[];
}