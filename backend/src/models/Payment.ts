import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DeviceCode } from './DeviceCode';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  deviceCodeId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  })
  status: string;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  paidDate: Date;

  @ManyToOne(() => DeviceCode)
  @JoinColumn({ name: 'deviceCodeId' })
  deviceCode: DeviceCode;

  @CreateDateColumn()
  createdAt: Date;
}
