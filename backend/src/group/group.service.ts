import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    private readonly fileService: FileService
  ) { }

  async findAll() {
    return await this.groupRepository.find({ order: { id: "ASC" }, relations: ['tracks', 'albums'] });
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({ where: { id }, relations: ['tracks', 'albums'] });

    if (group) {
      return group
    } else {
      throw new HttpException("Группа не найдена", HttpStatus.NOT_FOUND)
    }
  }

  async create(createGroupDto: CreateGroupDto, cover: any) {
    const group = await this.groupRepository.findOne({ where: { title: createGroupDto.title } });

    if (group) {
      throw new HttpException("Группа с таким названием уже существует", HttpStatus.BAD_REQUEST)
    } else {
      const coverPath = this.fileService.createFile(cover, FileTypes.ARTIST)
      return await this.groupRepository.save({ ...createGroupDto, cover: coverPath })
    }
  }
}
