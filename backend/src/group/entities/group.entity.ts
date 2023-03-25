import { TrackEntity } from 'src/track/entities/track.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlbumEntity } from './../../album/entities/album.entity';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  cover: string;

  @Column()
  byUserId: number;

  @OneToMany(() => TrackEntity, (track) => track.artist)
  tracks: TrackEntity[];

  @OneToMany(() => AlbumEntity, (album) => album.group)
  albums: AlbumEntity[];
}
