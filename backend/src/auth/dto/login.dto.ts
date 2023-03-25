import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: 'Логин' })
  readonly login: string;

  @IsString()
  @ApiProperty({ description: 'Пароль' })
  readonly password: string;
}
