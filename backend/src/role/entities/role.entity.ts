import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from './../../user/entities/user.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  users: UserEntity[];
}
