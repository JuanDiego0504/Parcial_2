import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  DONE = 'done',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => User, { nullable: false, eager: true })
  user: User;

  
  @Column({ type: 'timestamptz' })
  datetime: Date;


  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}