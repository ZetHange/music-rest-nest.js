import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: 'Логин' })
  @IsString()
  readonly login: string;

  @ApiProperty({ description: 'Электропочта' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Аватар' })
  readonly avatar: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  readonly password: string;
}
