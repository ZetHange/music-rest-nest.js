import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';

@Controller('role')
@ApiBearerAuth()
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все роли' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить роль по ID' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создать роль' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch('edit/:id')
  @ApiOperation({ summary: 'Изменить роль' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удалить роль' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
