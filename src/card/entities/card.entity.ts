import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number;

  @Column('decimal', { precision: 12, scale: 2 })
  remainingValue: number;

  @Column({ type: 'timestamp' })
  expireAt: Date;

  @ManyToMany(() => Service, { eager: true })
  @JoinTable()
  services: Service[];

  @ManyToMany(() => Partner, { eager: true })
  @JoinTable()
  partners: Partner[];

  @ManyToOne(() => ReferralCode, { nullable: true, eager: true })
  referralCode?: ReferralCode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
