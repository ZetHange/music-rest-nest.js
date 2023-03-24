import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumEntity } from './entities/album.entity';
import { GroupModule } from './../group/group.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity]), GroupModule, FileModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService]
})
export class AlbumModule { }
