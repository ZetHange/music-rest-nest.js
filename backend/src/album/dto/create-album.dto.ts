import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Название альбома' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'number',
    description: 'Описание альбома',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Обложка альбома',
  })
  cover: string;

  @ApiProperty({ type: 'string', format: 'number', description: 'ID группы' })
  groupId: number;
}
