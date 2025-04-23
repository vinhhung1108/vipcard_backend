import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Partner } from '@src/partner/entities/partner.entity';
import { Service } from '@src/service/entities/service.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal')
  value: number;

  @Column('decimal')
  remainingValue: number;

  @Column({ type: 'date' })
  expireAt: Date;

  @ManyToMany(() => Service)
  @JoinTable()
  services: Service[];

  @ManyToMany(() => Partner)
  @JoinTable()
  partners: Partner[];

  @ManyToOne(() => ReferralCode, { nullable: true })
  referralCode: ReferralCode;
}
