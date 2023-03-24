import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';


@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity]), AuthModule, FileModule],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule { }
