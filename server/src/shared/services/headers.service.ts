import { Injectable } from '@nestjs/common';
import { IUserTokens } from '../../modules/token/interfaces/tokens.interface';

@Injectable()
export class HeadersService {
    constructor() {}

    getBearerToken(headers): string {
        return headers.authorization.slice(7);
    }

    getCryptToken(headers): string {
        return headers.crypt;
    }

    getUserTokens(headers): IUserTokens {
        return { authToken: this.getBearerToken(headers), cryptToken: this.getCryptToken(headers) };
    }
}
