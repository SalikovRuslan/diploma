import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenService } from '../token/token.service';
import { IUser } from '../user/interfaces/user.interface';
import { HeadersService } from '../../shared/services/headers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private headersService: HeadersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req, user: Partial<IUser>) {
        const token = this.headersService.getBearerToken(req.headers);
        const cryptToken = this.headersService.getCryptToken(req.headers);

        if (token.length && cryptToken.length && (await this.tokenService.exists(user._id, token))) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
