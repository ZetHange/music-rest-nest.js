import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Название группы' })
  readonly title: string;

  @ApiProperty({ description: 'Описание группы' })
  readonly description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Обложка группы',
  })
  readonly cover: string;
}
