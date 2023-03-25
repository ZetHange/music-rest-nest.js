import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService, FileTypes } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly fileService: FileService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async findAll() {
    return await this.groupRepository.find({
      order: { id: 'ASC' },
      relations: ['tracks', 'albums'],
    });
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['tracks', 'albums'],
    });

    if (group) {
      return group;
    } else {
      throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND);
    }
  }

  async create(createGroupDto: CreateGroupDto, cover: any) {
    const group = await this.groupRepository.findOne({
      where: { title: createGroupDto.title },
    });

    if (group) {
      throw new HttpException(
        'Группа с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = await this.request.user;
      const coverPath = this.fileService.createFile(cover, FileTypes.ARTIST);
      return await this.groupRepository.save({
        ...createGroupDto,
        cover: coverPath,
        byUserId: user.id,
      });
    }
  }

  async update(id: number, updateGroupDto: CreateGroupDto, cover: any) {
    const group = await this.groupRepository.findOne({
      where: { id },
    });

    if (group) {
      const user = await this.request.user;
      let coverPath: string;
      if (cover) {
        coverPath = this.fileService.createFile(cover, FileTypes.ARTIST);
      }
      const updatedGroup = {
        ...group,
        ...updateGroupDto,
        cover: coverPath ? coverPath : group.cover,
      };

      if (group.byUserId === user.id) {
        return await this.groupRepository.save(updatedGroup);
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.groupRepository.save(updatedGroup);
      } else {
        throw new HttpException(
          'Вы не имеете права редакитровать эту группу',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'Группы с таким ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
    });

    if (group) {
      const user = await this.request.user;
      if (group.byUserId === user.id) {
        return await this.groupRepository.delete({ id });
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.groupRepository.delete({ id });
      } else {
        throw new HttpException(
          'Вы не имеете права удалять эту группу',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'Группы с таким ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
