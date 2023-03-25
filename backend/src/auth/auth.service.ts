import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './../user/user.service';
import { UserEntity } from './../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto) {
    const user = await this.validateUser(userDto);
    console.log(user);
    if (!user) throw new UnauthorizedException('Неправильный логин или пароль');
    if (!user.isVerifiedEmail)
      throw new HttpException(
        'Необходимо потвердить почту',
        HttpStatus.BAD_REQUEST,
      );
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto, avatar: any) {
    const candidate = await this.userService.getUserByLogin(userDto.login);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким логином уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    await this.userService.createUser(
      { ...userDto, password: hashPassword },
      avatar,
    );
    return {
      statusCode: 200,
      message: 'Регистрация прошла успешно, проверьте почту',
    };
  }

  private async validateUser(userDto: LoginDto) {
    const user = await this.userService.getUserByLogin(userDto.login);
    if (user) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({
      message: 'Некорректный логин или пароль',
    });
  }

  private async generateToken(user: UserEntity) {
    const payload = {
      id: user.id,
      login: user.login,
      email: user.email,
      roles: user.roles,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
