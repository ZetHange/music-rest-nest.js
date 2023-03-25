import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('group')
@ApiBearerAuth()
@ApiTags('Artist')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех артистов' })
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение артиста по ID' })
  findOne(@Param('id') id: number) {
    return this.groupService.findOne(id);
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Создание артиста' })
  @UseInterceptors(FileInterceptor('cover'))
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  create(@UploadedFile() cover: any, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto, cover);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Редактирование артиста' })
  @UseInterceptors(FileInterceptor('cover'))
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: number,
    @UploadedFile() cover: any,
    @Body() updateGroupDto: CreateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto, cover);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Удаление артиста' })
  @UseInterceptors(FileInterceptor('cover'))
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.groupService.delete(id);
  }
}
