import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUserToken } from './interfaces/user-token.interface';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { CryptService } from '../../shared/services/crypt.service';

@Injectable()
export class TokenService {
    constructor(@InjectModel('Token') private readonly tokenModel: Model<IUserToken>, private cryptService: CryptService) {}

    async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
        const userToken = new this.tokenModel(createUserTokenDto);
        const tokens = await this.tokenModel.find({ uId: createUserTokenDto.uId.toHexString() }).exec();
        if (tokens.length > 5) {
            tokens.forEach(token => token.remove());
        }
        return await userToken.save();
    }

    async delete(uId: string, token: string): Promise<{ ok?: number; n?: number }> {
        return this.tokenModel.deleteOne({uId, token});
    }

    async deleteAll(uId: string): Promise<{ ok?: number; n?: number }> {
        return this.tokenModel.deleteMany({uId});
    }

    async exists(uId: string, token: string): Promise<boolean> {
        return await this.tokenModel.exists({ uId, token });
    }

    async getTokenModel(token: string): Promise<Partial<IUserToken>> {
        return await this.tokenModel.findOne({ token }).exec();
    }

    async getDecryptedMasterKey(authToken, cryptToken): Promise<string> {
        const { encryptedMasterKey } = await this.getTokenModel(authToken);
        return this.cryptService.decryptData(encryptedMasterKey, cryptToken);
    }
}
