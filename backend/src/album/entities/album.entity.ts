import { GroupEntity } from "src/group/entities/group.entity"
import { TrackEntity } from "src/track/entities/track.entity"
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"

@Entity('album')
export class AlbumEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    cover: string

    @OneToMany(() => TrackEntity, (track) => track.artist)
    tracks: TrackEntity[]

    @ManyToOne(() => GroupEntity, (group) => group.albums)
    group: GroupEntity
}