import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
@ApiTags('Album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех альбомов' })
  getAll() {
    return this.albumService.getAll()
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание нового альбома' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover'))
  createAlbum(@UploadedFile() cover: any, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto, cover)
  }
}
