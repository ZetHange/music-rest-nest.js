import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/role/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll() {
    return await this.roleRepository.find({
      select: {
        ...RoleEntity,
        users: { id: true, login: true, email: true, avatar: true },
      },
      relations: ['users'],
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      select: {
        ...RoleEntity,
        users: { id: true, login: true, email: true, avatar: true },
      },
      relations: ['users'],
      where: { id },
    });
    if (role) return role;
    throw new HttpException('Роль с таким ID не найдена', HttpStatus.NOT_FOUND);
  }

  async findOneByTitle(title: string) {
    const role = await this.roleRepository.findOne({ where: { title } });
    if (role) return role;
    throw new HttpException(
      'Роль с таким названием не найдена',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { title: createRoleDto.title },
    });

    if (role) {
      throw new HttpException(
        'Роль с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.roleRepository.save(createRoleDto);
  }

  async createDefaultRoles() {
    const roleCount = await this.roleRepository.count();

    if (!roleCount) {
      await this.roleRepository.save({
        title: 'USER',
        description: 'Пользователь',
      });
      await this.roleRepository.save({
        title: 'ADMIN',
        description: 'Администратор',
      });
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (role) {
      return await this.roleRepository.save({ ...role, ...updateRoleDto });
    } else {
      throw new HttpException(
        'Роль с таким ID не найдена',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (role) {
      return await this.roleRepository.delete({ id });
    } else {
      throw new HttpException(
        'Роль с таким ID не найдена',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
