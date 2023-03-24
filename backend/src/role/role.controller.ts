import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все роли' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить роль по ID' })
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создать роль' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch('edit/:id')
  @ApiOperation({ summary: 'Изменить роль' })
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удалить роль' })
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
