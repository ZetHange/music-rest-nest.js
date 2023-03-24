import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @ApiProperty({ description: "Название трека" })
  readonly title: string;
  
  @IsString()
  @ApiProperty({ description: "Описание трека" })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'number', description: "Автор трека", required: false })
  readonly artistId: number;

  @ApiProperty({ type: 'string', format: 'binary', description: "Обложка трека" })
  readonly cover: string;

  @ApiProperty({ type: 'string', format: 'number', description: "ID Альбома", required: false })
  readonly albumId: number;
  
  @ApiProperty({ type: 'string', format: 'binary', description: "Ссылка на аудиофайл трека" })
  readonly audio: string;
}