import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Card } from '@src/card/entities/card.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Card, (card) => card.services)
  cards: Card[];
}
