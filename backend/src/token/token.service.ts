import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async setToken(token: string, userEmail: string) {
    return await this.tokenRepository.save({ token, userEmail });
  }

  async getToken(token: string) {
    return await this.tokenRepository.findOne({ where: { token } });
  }

  async getTokenByEmail(email: string) {
    return await this.tokenRepository.findOne({ where: { userEmail: email } });
  }

  async deleteToken(token: string) {
    return await this.tokenRepository.delete({ token });
  }
}
