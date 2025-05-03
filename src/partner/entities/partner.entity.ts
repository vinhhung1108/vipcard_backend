import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  address?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  phone?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  email?: string;
}
