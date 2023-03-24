import { Controller, Get, UseGuards, Query, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  getUsers() {
    return this.userService.getAllUsers()
  }

  @Get('verify')
  @ApiOperation({ summary: 'Потверждение аккаунта' })
  verify(@Query('token') token: string) {
    return this.userService.verify(token)
  }

  @Delete('delete/:userId')
  @ApiOperation({ summary: 'Удалить пользователя' })
  delete(@Param('userId') userId: number) {
    return this.userService.delete(userId)
  }
}
