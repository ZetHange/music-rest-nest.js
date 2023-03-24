import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";
import * as path from 'path';

export enum FileTypes {
  AUDIO = 'audio',
  COVER = 'cover',
  AVATAR = 'avatar',
  ALBUM_COVER = 'album',
  ARTIST = 'artist',
}

@Injectable()
export class FileService {
  createFile(file: any, type: string) {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = uuidv4() + '.' + fileExtension
      const filePath = path.resolve(__dirname, '..', 'static', type)
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
      return '/static/' +  type + '/' + fileName
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  removeFile() { }
}
