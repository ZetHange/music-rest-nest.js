import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('group')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех музыкальных групп' })
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение музыкальной группы по ID' })
  findOne(@Param('id') id: number) {
    return this.groupService.findOne(id);
  }
  
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Создание музыкальной группы' })
  @UseInterceptors(FileInterceptor('cover'))
  create(@UploadedFile() cover: any, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto, cover);
  }
}
