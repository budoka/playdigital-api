import { IsAlphanumeric, IsString, IsUUID, MinLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Currency from './currency.entity';

@Entity('User')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ name: 'firstname', type: 'varchar', length: 255, nullable: false })
  firstname: string;

  @IsString()
  @Column({ name: 'lastname', type: 'varchar', length: 255, nullable: false })
  lastname: string;

  @IsString()
  @Column({ name: 'username', type: 'varchar', length: 255, nullable: false, unique: true })
  username: string;

  @MinLength(8)
  @IsAlphanumeric()
  @Column({ name: 'password', type: 'varchar', length: 44, nullable: false })
  password: string;

  @Column({ name: 'salt', type: 'varchar', length: 24, nullable: false })
  salt: string;

  @ManyToOne((type) => Currency, (currency) => currency.id, { eager: true })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @IsUUID('4')
  @Column({ name: 'currencyId', type: 'uuid', length: 36 })
  currencyId: string;

  @CreateDateColumn({ name: 'creationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @UpdateDateColumn({ name: 'modificationDate', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  modificationDate: Date;
}
