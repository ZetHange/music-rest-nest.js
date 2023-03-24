import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GroupService } from 'src/group/group.service';
import { FileService, FileTypes } from 'src/file/file.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
    private readonly groupService: GroupService,
    private readonly fileService: FileService,
  ) {}

  async getAll() {
    return await this.albumRepository.find({ relations: ['tracks', 'group'] })
  }

  async createAlbum(dto: CreateAlbumDto, cover: any) {
    const group = await this.groupService.findOne(dto.groupId)
    
    if (group) {
      const coverPath = this.fileService.createFile(cover, FileTypes.ALBUM_COVER)
      return await this.albumRepository.save({ ...dto, group, cover: coverPath })
    } else {
      throw new HttpException('Группа с таким ID не существует', HttpStatus.BAD_REQUEST)
    }
  }

  async getAlbumById(id: number) {
    const album = await this.albumRepository.findOne({ where: { id } })

    if (album) return album
    throw new HttpException('Альбом не найден', HttpStatus.NOT_FOUND)
  }
}
