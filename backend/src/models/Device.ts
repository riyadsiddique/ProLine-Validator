import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { DeviceCode } from './DeviceCode';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column()
  androidVersion: string;

  @Column({ nullable: true })
  imei: string;

  @Column()
  isRooted: boolean;

  @Column()
  deviceCodeId: string;

  @Column({
    type: 'enum',
    enum: ['active', 'locked', 'unlocked'],
    default: 'active'
  })
  status: string;

  @OneToOne(() => DeviceCode)
  @JoinColumn({ name: 'deviceCodeId' })
  deviceCode: DeviceCode;

  @CreateDateColumn()
  createdAt: Date;
}
