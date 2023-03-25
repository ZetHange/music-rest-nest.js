import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GroupService } from 'src/group/group.service';
import { FileService, FileTypes } from 'src/file/file.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
    private readonly groupService: GroupService,
    private readonly fileService: FileService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async getAll() {
    return await this.albumRepository.find({ relations: ['tracks', 'group'] });
  }

  async getAlbumById(id: number) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (album) return album;
    throw new HttpException('Альбом не найден', HttpStatus.NOT_FOUND);
  }

  async createAlbum(dto: CreateAlbumDto, cover: any) {
    const album = await this.albumRepository.findOne({
      where: { title: dto.title },
    });
    const group = await this.groupService.findOne(dto.groupId);
    const user = await this.request.user;

    if (album) {
      throw new HttpException(
        'Альбом с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    } else if (group) {
      const coverPath = this.fileService.createFile(
        cover,
        FileTypes.ALBUM_COVER,
      );
      return await this.albumRepository.save({
        ...dto,
        group,
        cover: coverPath,
        byUserId: user.id,
      });
    } else {
      throw new HttpException(
        'Группа с таким ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateAlbumDto: CreateAlbumDto, cover: any) {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (album) {
      const updatedAlbum = {
        ...album,
        ...updateAlbumDto,
        cover: cover ? cover : album.cover,
      };
      const user = await this.request.user;
      if (album.id === user.id) {
        return await this.albumRepository.save(updatedAlbum);
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.albumRepository.save(updatedAlbum);
      } else {
        throw new HttpException(
          'Вы не имеете права редактировать этот альбом',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'Альбома с таким ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (album) {
      const user = await this.request.user;

      if (album.id === user.id) {
        return await this.albumRepository.delete({ id });
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.albumRepository.delete({ id });
      } else {
        throw new HttpException(
          'Вы не имеете права удалять этот альбом',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'Альбома с таким ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
