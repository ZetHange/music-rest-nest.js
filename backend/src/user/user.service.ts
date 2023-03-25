import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as pug from 'pug';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService, FileTypes } from 'src/file/file.service';
import { RoleService } from 'src/role/role.service';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenService } from './../token/token.service';
import { REQUEST } from '@nestjs/core';
import e from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        login: true,
        email: true,
        avatar: true,
        isVerifiedEmail: true,
      },
      relations: ['roles'],
    });
  }

  async getMe() {
    const userByRequest = await this.request.user;
    const user = await this.userRepository.findOne({
      where: { id: userByRequest.id },
      select: {
        id: true,
        login: true,
        email: true,
        avatar: true,
        isVerifiedEmail: true,
      },
      relations: ['roles'],
    });
    return user;
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({
      where: { login },
      relations: ['roles'],
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async createUser(createUserDto: CreateUserDto, avatar: any) {
    const userCandidateByLogin = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });
    const userCandidateByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userCandidateByLogin || userCandidateByEmail) {
      throw new HttpException(
        'Пользователь с таким именем или email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const avatarPath = this.fileService.createFile(avatar, FileTypes.AVATAR);

      const newUser = this.userRepository.create({
        ...createUserDto,
        isVerifiedEmail: false,
        avatar: avatarPath,
      });

      const token = await uuidv4();
      await this.tokenService.setToken(token, newUser.email);

      this.mailerService.sendMail({
        to: newUser.email,
        from: '"Music API" <admin@scc-pro.ml>',
        subject: 'Потверждение email',
        template: __dirname + '/templates/confirmEmail',
        context: {
          login: newUser.login,
          year: new Date().getFullYear(),
          link: `http://localhost/api/user/verify?token=${token}`,
        },
      });

      await this.roleService.createDefaultRoles();
      return await this.userRepository.save(newUser);
    }
  }

  async verify(token: string) {
    const tokenCandidate = await this.tokenService.getToken(token);
    const userCount = await this.userRepository.count();

    if (tokenCandidate) {
      const role = await this.roleService.findOneByTitle('USER');
      const roleAdmin = await this.roleService.findOneByTitle('ADMIN');

      const user = await this.userRepository.findOne({
        where: { email: tokenCandidate.userEmail },
      });

      const userUpdated = {
        ...user,
        isVerifiedEmail: true,
        roles: userCount === 1 ? [role, roleAdmin] : [role],
      };

      console.log(JSON.stringify(userUpdated));

      await this.userRepository.save(userUpdated);
      await this.tokenService.deleteToken(token);

      const file = pug.compileFile(__dirname + '/templates/confirmedEmail.pug');
      return file({
        login: userUpdated.login,
        avatar: userUpdated.avatar,
      });
    }
    throw new HttpException('Неверный токен', HttpStatus.BAD_REQUEST);
  }

  async delete(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user) {
      const token = await this.tokenService.getTokenByEmail(user.email);
      if (token) this.tokenService.deleteToken(token.token);
      return await this.userRepository.delete(user);
    }
    throw new HttpException(
      'Пользователя с таким ID не существует',
      HttpStatus.BAD_REQUEST,
    );
  }

  async addRole(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    const role = await this.roleService.findOne(roleId);

    if (user && role) {
      const updatedUser = {
        ...user,
        roles: [...user.roles, role],
      };

      return await this.userRepository.save(updatedUser);
    } else {
      throw new HttpException(
        'Пользователя или роли с такими ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeRole(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    const role = await this.roleService.findOne(roleId);

    if (user && role) {
      const updatedUser = {
        ...user,
        roles: user.roles.filter((n: any) => Number(n.id) !== Number(roleId))
      };

      return await this.userRepository.save(updatedUser);
    } else {
      throw new HttpException(
        'Пользователя или роли с такими ID не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
