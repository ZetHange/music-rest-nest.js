import { AlbumEntity } from 'src/album/entities/album.entity';
import { GroupEntity } from 'src/group/entities/group.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('track')
export class TrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks)
  album: AlbumEntity;

  @ManyToOne(() => GroupEntity, (group) => group.tracks)
  artist: GroupEntity;

  @Column()
  description: string;

  @Column()
  cover: string;

  @Column()
  audio: string;

  @Column()
  listens: number;

  @Column()
  byUserId: number;
}
