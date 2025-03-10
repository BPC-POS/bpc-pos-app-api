import { Entity, Column, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomBaseEntity } from '../../common/abstract.entity';
import { TableArea } from './TableArea.entity';

@Entity({ name: 'tables' })
export class Table extends CustomBaseEntity {
  @Column()
  name!: string;

  @Column()
  capacity!: number;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  status!: number;

  @ManyToOne(() => TableArea, (tableArea) => tableArea.tables)
  area!: Relation<TableArea>;
}