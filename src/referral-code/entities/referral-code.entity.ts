import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '@src/card/entities/card.entity';

@Entity()
export class ReferralCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @OneToMany(() => Card, (card) => card.referralCode)
  cards: Card[];
}
