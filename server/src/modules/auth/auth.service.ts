import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';
import * as moment from 'moment';

import { CryptService } from '../../shared/services/crypt.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { CreateUserTokenDto } from '../token/dto/create-user-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

import { ReadableUser } from '../user/models/readable-user.model';
import { IUser } from '../user/interfaces/user.interface';
import { ITokenPayload } from './interfaces/token-payload.interface';

import { RolesEnum } from '../user/enums/roles.enum';
import { statusEnum } from '../user/enums/status.enum';

@Injectable()
export class AuthService {
    private clientAppUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {
        this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
    }

    public async registration(createdUserDto: CreateUserDto): Promise<boolean> {
        const createdUser = await this.userService.create(createdUserDto, [RolesEnum.user]);
        // token for confirm user, when mail server will add to project, delete auto confirm;
        const token = await this.sendConfirmation(createdUser);
        // await this.confirm(token);

        return true;
    }

    public async login({ email, password }: LoginDto): Promise<ReadableUser> {
        const user = await this.userService.findByEmail(email);

        if (user && (await this.cryptService.compare(password, user.password))) {
            const tokenPayload: ITokenPayload = {
                _id: user._id,
                status: user.status,
                roles: user.roles,
            };
            const token = await this.generateToken(tokenPayload);
            const expireAt = moment().add(1, 'day').toISOString();

            await this.saveToken({
                token,
                expireAt,
                uId: user._id,
            });

            const readableUser = user.toObject() as ReadableUser;
            readableUser.accessToken = token;

            return new ReadableUser(readableUser);
        }
        throw new BadRequestException('Invalid credentials');
    }

    private async sendConfirmation(user: IUser) {
        const expiresIn = 60 * 60 * 24; // 24 hours
        const tokenPayload = {
            _id: user._id,
            status: user.status,
            roles: user.roles,
        };

        const expireAt = moment().add(1, 'day').toISOString();
        const token = await this.generateToken(tokenPayload, { expiresIn });
        await this.saveToken({ token, uId: user._id, expireAt });
        return token;

        // const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
        // await this.mailService.send({
        //     from: this.configService.get<string>('JS_CODE_MAIL'),
        //     to: user.email,
        //     subject: 'Verify User',
        //     html: `
        //         <h3>Hello ${user.firstName}!</h3>
        //         <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
        //     `,
        // });
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<boolean> {
        const password = await this.userService.hashPassword(changePasswordDto.password);

        await this.userService.update(changePasswordDto._id, { password });
        await this.tokenService.deleteAll(changePasswordDto._id);
        return true;
    }

    async confirm(token: string): Promise<IUser> {
        const data = await this.verifyToken(token);
        const user = await this.userService.find(data._id);

        await this.tokenService.delete(data._id, token);

        if (user && user.status === statusEnum.pending) {
            user.status = statusEnum.active;
            return user.save();
        }
        throw new BadRequestException('Confirmation error');
    }

    private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
        return this.jwtService.sign(data, options);
    }

    private async verifyToken(token): Promise<ITokenPayload> {
        try {
            const data = this.jwtService.verify(token) as ITokenPayload;
            const tokenExists = await this.tokenService.exists(data._id, token);

            if (tokenExists) {
                return data;
            }
            throw new UnauthorizedException();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    private async saveToken(createUserTokenDto: CreateUserTokenDto) {
        return await this.tokenService.create(createUserTokenDto);
    }
}
