import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Название роли, желательно на англ. заглавными буквами',
  })
  title: string;

  @ApiProperty({ description: 'Описание роли' })
  description: string;
}
