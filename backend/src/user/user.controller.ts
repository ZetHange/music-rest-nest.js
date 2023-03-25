import {
  Controller,
  Get,
  UseGuards,
  Query,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Получение авторизованного пользователя' })
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  getMe() {
    return this.userService.getMe();
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get('verify')
  @ApiOperation({ summary: 'Потверждение аккаунта' })
  verify(@Query('token') token: string) {
    return this.userService.verify(token);
  }

  @Post('addRole')
  @ApiOperation({ summary: 'Добавить роль пользователю' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  addRole(@Query('userId') userId: number, @Query('roleId') roleId: number) {
    return this.userService.addRole(userId, roleId);
  }

  @Post('deleteRole')
  @ApiOperation({ summary: 'Удалить роль у пользователя' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  deleteRole(@Query('userId') userId: number, @Query('roleId') roleId: number) {
    return this.userService.removeRole(userId, roleId);
  }

  @Delete('delete/:userId')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('userId') userId: number) {
    return this.userService.delete(userId);
  }
}
