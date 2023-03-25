import { RoleEntity } from 'src/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  avatar: string;

  @Column()
  password: string;

  @Column()
  isVerifiedEmail: boolean;

  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}
