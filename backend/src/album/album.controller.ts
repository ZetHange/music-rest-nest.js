import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
@ApiBearerAuth()
@ApiTags('Album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех альбомов' })
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение всех альбомов' })
  getById(@Param('id') id: number) {
    return this.albumService.getAlbumById(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание нового альбома' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover'))
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  create(@UploadedFile() cover: any, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto, cover);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Обновление альбома' })
  @ApiConsumes('multipart/form-data')
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('cover'))
  update(
    @Param('id') id: number,
    @UploadedFile() cover: any,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return this.albumService.update(id, createAlbumDto, cover);
  }

  @Delete('update/:id')
  @ApiOperation({ summary: 'Обновление альбома' })
  @ApiConsumes('multipart/form-data')
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('id') id: number) {
    return this.albumService.delete(id);
  }
}
