import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Авторизация' })
  login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('registration')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  registration(@UploadedFile() avatar: any, @Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto, avatar);
  }
}
