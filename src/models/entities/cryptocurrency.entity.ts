import { IsCurrency, IsString, IsUrl, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';

@Entity('Cryptocurrency')
export default class Cryptocurrency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @IsString()
  @Length(3, 3)
  @Column({ name: 'symbol', type: 'varchar', length: 3, nullable: false, unique: true })
  symbol: string;

  @IsCurrency({ allow_negatives: false })
  @Column({ name: 'price', type: 'decimal', precision: 8, scale: 2, nullable: false })
  price: number;

  @IsUrl()
  @Column({ name: 'url', type: 'varchar', length: 2083, nullable: true })
  url: string;

  @ManyToMany(
    (type) => User,
    (user) => user.id,
    // { eager: true },
  )
  @JoinTable({ name: 'cryptocurrency_user', joinColumn: { name: 'cryptocurrencyId' }, inverseJoinColumn: { name: 'userId' } })
  user: User[];

  @CreateDateColumn({ name: 'creationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @UpdateDateColumn({ name: 'modificationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  modificationDate: Date;

  /*@OneToMany((type) => User, (user) => user.id)
  user: User[];*/
}
