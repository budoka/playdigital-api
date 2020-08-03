import { IsString, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';

@Entity('Currency')
export default class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @IsString()
  @Length(3, 3)
  @Column({ name: 'symbol', type: 'varchar', length: 3, nullable: false, unique: true })
  symbol: string;

  @CreateDateColumn({ name: 'creationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @UpdateDateColumn({ name: 'modificationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  modificationDate: Date;

  @OneToMany((type) => User, (user) => user.id)
  user: User[];
}
