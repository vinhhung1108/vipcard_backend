import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('referral_codes')
export class ReferralCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;
}
