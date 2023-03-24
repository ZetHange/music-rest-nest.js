import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackEntity } from './entities/track.entity';
import { GroupService } from './../group/group.service';
import { FileService, FileTypes } from 'src/file/file.service';
import Fuse from 'fuse.js';
import { AlbumService } from './../album/album.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
    private readonly groupService: GroupService,
    private readonly fileService: FileService,
    private readonly albumSerive: AlbumService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async getAllTracks(pageSize: number, page: number): Promise<TrackEntity[]> {
    return await this.trackRepository.find({
      order: {
        id: 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['artist', 'album'],
    });
  }

  async getTopTracks(pageSize: number, page: number) {
    return await this.trackRepository.find({
      order: {
        listens: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['artist', 'album'],
    });
  }

  async searchTrack(q: string, pageSize: number, page: number) {
    const tracks = await this.trackRepository.find({
      relations: ['artist', 'album'],
      order: { id: 'ASC' },
    });

    const options = {
      keys: ['title', 'description'],
    };

    const fuse = new Fuse(tracks, options);

    if (fuse) {
      const results = fuse.search(q);
      const resultsRefactor: any[] = [];

      results.map((track) => {
        resultsRefactor.push(track.item);
      });

      return resultsRefactor.slice((page - 1) * pageSize, page * pageSize);
    } else {
      throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND);
    }
  }

  async getTrackById(id: number) {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (track) return track;
    throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND);
  }

  async listens(trackId: number) {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
      relations: ['artist', 'album'],
    });

    if (track) {
      return await this.trackRepository.update(
        { id: trackId },
        { listens: track.listens + 1 },
      );
    } else {
      throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND);
    }
  }

  async updateTrack(trackId: number, updateTrackDto: UpdateTrackDto) {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
      relations: ['artist', 'album'],
    });

    if (track) {
      const user = this.request.user;

      const updatedTrack = {
        ...track,
        ...updateTrackDto,
      };

      if (track.byUserId === user.id) {
        return await this.trackRepository.save(updatedTrack);
      } else if (
        user.roles.filter((i: any) => i.title === 'ADMIN').length
      ) {
        return await this.trackRepository.save(updatedTrack);
      } else {
        throw new HttpException(
          'Вы не имеете права редактировать этот трек',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    throw new HttpException(
      'Трека с таким ID не существует',
      HttpStatus.BAD_REQUEST,
    );
  }

  async createTrack(createTrackDto: CreateTrackDto, cover: any, audio: any) {
    const track = await this.trackRepository.findOne({
      where: { title: createTrackDto.title },
    });

    if (track) {
      throw new HttpException(
        'Трек с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const audioPath = this.fileService.createFile(cover, FileTypes.COVER);
      const coverPath = this.fileService.createFile(audio, FileTypes.AUDIO);

      const user = await this.request.user;

      let album = null;
      if (createTrackDto.albumId) {
        album = await this.albumSerive.getAlbumById(createTrackDto.albumId);
      }

      let group = null;
      if (createTrackDto.artistId) {
        group = await this.groupService.findOne(createTrackDto.artistId);
      }

      return await this.trackRepository.save({
        ...createTrackDto,
        listens: 0,
        artist: group,
        audio: audioPath,
        cover: coverPath,
        byUserId: user.id,
        album,
      });
    }
  }

  async addGroup(groupId: number, trackId: number) {
    const group = await this.groupService.findOne(groupId);
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
      relations: ['artist', 'album'],
    });

    if (group && track) {
      const user = await this.request.user;

      if (track.byUserId === user.id) {
        return await this.trackRepository.save({ ...track, artist: group });
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.trackRepository.save({ ...track, artist: group });
      } else {
        throw new HttpException(
          'Вы не имеете права редактировать этот трек',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    throw new HttpException(
      'Такой группы или трека не существует',
      HttpStatus.BAD_REQUEST,
    );
  }

  async delete(trackId: number) {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (track) {
      const user = await this.request.user;

      if (track.byUserId === user.id) {
        return await this.trackRepository.delete({ id: trackId });
      } else if (user.roles.filter((i: any) => i.title === 'ADMIN').length) {
        return await this.trackRepository.delete({ id: trackId });
      } else {
        throw new HttpException(
          'Вы не имеете права удалять этот трек',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    throw new HttpException(
      'Трека с таким ID не существует',
      HttpStatus.BAD_REQUEST,
    );
  }
}
