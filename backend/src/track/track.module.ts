import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackEntity } from './entities/track.entity';
import { GroupModule } from 'src/group/group.module';
import { AlbumModule } from './../album/album.module';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([TrackEntity]),
    GroupModule,
    FileModule,
    AlbumModule,
    AuthModule
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
