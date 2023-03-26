import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';
import { RolesGuard } from './../auth/guards/roles.guard';

@Controller('track')
@ApiBearerAuth()
@ApiTags('Track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех треков' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getAll(
    @Query('pageSize', new DefaultValuePipe(1000), ParseIntPipe)
    pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.trackService.getAllTracks(pageSize, page);
  }

  @Get('top')
  @ApiOperation({ summary: 'Получение топа треков' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getTop(
    @Query('pageSize', new DefaultValuePipe(1000), ParseIntPipe)
    pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.trackService.getTopTracks(pageSize, page);
  }

  @Get('search')
  @ApiOperation({ summary: 'Неточный поиск треков' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  searchTrack(
    @Query('q') q: string,
    @Query('pageSize', new DefaultValuePipe(1000), ParseIntPipe)
    pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.trackService.searchTrack(q, pageSize, page);
  }

  @Get(':trackId')
  @ApiOperation({ summary: 'Получение трека по ID' })
  getById(@Param('trackId') trackId: number) {
    return this.trackService.getTrackById(trackId);
  }

  @Post('addGroup')
  @ApiOperation({ summary: 'Добавить группу для трека' })
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  addGroup(
    @Query('groupId') groupId: number,
    @Query('trackId') trackId: number,
  ) {
    return this.trackService.addGroup(groupId, trackId);
  }

  @Post('listen')
  @ApiOperation({ summary: 'Увеличить кол-во прослушиваний трека' })
  listens(@Query('trackId') trackId: number) {
    return this.trackService.listens(trackId);
  }

  @Patch('update/:trackId')
  @ApiOperation({ summary: 'Изменение трека' })
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  updateTrack(
    @Param('trackId') trackId: number,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.updateTrack(trackId, updateTrackDto);
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание трека' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  createTrack(
    @UploadedFiles() files: any,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    const { cover, audio } = files;
    return this.trackService.createTrack(createTrackDto, cover, audio);
  }

  @Delete('delete/:trackId')
  @ApiOperation({ summary: 'Удаление трека' })
  @Roles('USER', 'ADMIN')
  @UseGuards(RolesGuard)
  delete(@Param('trackId') trackId: number) {
    return this.trackService.delete(trackId);
  }
}
