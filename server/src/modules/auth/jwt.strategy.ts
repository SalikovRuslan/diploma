import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenService } from '../token/token.service';
import { IUser } from '../user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, private readonly tokenService: TokenService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req, user: Partial<IUser>) {
        const token = req.headers.authorization.slice(7);
        const tokenExists = await this.tokenService.exists(user._id, token);
        if (tokenExists) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
