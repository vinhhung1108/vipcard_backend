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

  @Column()
  code: string;

  @Column('decimal')
  value: number;

  @Column('decimal')
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
  referralCode: ReferralCode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
