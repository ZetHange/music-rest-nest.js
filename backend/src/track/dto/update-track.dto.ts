import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiProperty({ description: 'Название' })
  readonly title: string;

  @ApiProperty({ description: 'Описание' })
  readonly description: string;

  // @ApiProperty({ type: 'string', format: 'binary', description: "Обложка трека" })
  // readonly cover: string;

  // @ApiProperty({ type: 'string', format: 'binary', description: "Аудиофайл трека" })
  // readonly audio: string;
}
