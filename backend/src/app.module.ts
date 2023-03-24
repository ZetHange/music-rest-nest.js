import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import { AuthModule } from './auth/auth.module';
import { AlbumModule } from './album/album.module';
import { RoleModule } from './role/role.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TokenModule } from './token/token.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
      serveRoot: '/static/',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: Number(process.env.POSTGRES_PORT),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    MailerModule.forRoot({
      transport: process.env.EMAIL_TRANSPORT,
      defaults: {
        from: process.env.EMAIL_DEFAULT_FROM,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TrackModule,
    UserModule,
    GroupModule,
    FileModule,
    AuthModule,
    AlbumModule,
    RoleModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
