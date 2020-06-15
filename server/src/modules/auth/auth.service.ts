import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';
import * as moment from 'moment';

import { CryptService } from '../../shared/services/crypt.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { AccountsService } from '../accounts/accounts.service';

import { CreateUserTokenDto } from '../token/dto/create-user-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

import { ReadableUser } from '../user/models/readable-user.model';
import { IUser } from '../user/interfaces/user.interface';
import { ITokenPayload } from './interfaces/token-payload.interface';

import { RolesEnum } from '../user/enums/roles.enum';
import { statusEnum } from '../user/enums/status.enum';
import { IUserTokens } from '../token/interfaces/tokens.interface';

@Injectable()
export class AuthService {
    private clientAppUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private accountsService: AccountsService,
    ) {
        this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
    }

    public async registration(createdUserDto: CreateUserDto): Promise<boolean> {
        const createdUser = await this.userService.create(createdUserDto, [RolesEnum.user]);
        // token for confirm user, when mail server will add to project, delete auto confirm;
        // const token = await this.sendConfirmation(createdUser);
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

            const crypto = this.cryptService.crypto;

            // хеш от пароля которым потом будем шифровать все аккаунты
            const masterKeyHash = crypto.SHA256(password).toString();
            // токен которым будем шифровать хеш от пароля, храним на фронте и передаем каждый раз
            const cryptToken = crypto.SHA256(crypto.lib.WordArray.random(16)).toString();
            // зашифрованый email для проверки токена при лоаде юзера
            const encryptedEmailForCheck = this.cryptService.encryptData(email, cryptToken);

            // зашифрованый хеш от мастера пароля, храним в базе
            const encryptedMasterKey = this.cryptService.encryptData(masterKeyHash, cryptToken);

            const token = await this.generateJwtToken(tokenPayload, { expiresIn: user.logoutTime });
            const expireAt = moment()
                .add(user.logoutTime, 's')
                .toISOString(true);

            await this.saveJwtToken({
                token,
                expireAt,
                uId: user._id,
                encryptedEmailForCheck,
                encryptedMasterKey,
            });

            const readableUser = user.toObject() as ReadableUser;

            readableUser.accessToken = token;
            readableUser.cryptToken = cryptToken;

            return new ReadableUser(readableUser);
        }
        throw new BadRequestException('Invalid credentials');
    }

    public async loadUser(userId, { authToken, cryptToken }: IUserTokens): Promise<ReadableUser> {
        // проверяем, что email который зашифрован в таблице токенов идентичен с email юзера id которого лежит в authToken
        const tokenModel = await this.tokenService.getTokenModel(authToken);
        const user = await this.userService.find(userId);
        const email = this.cryptService.decryptData(tokenModel.encryptedEmailForCheck, cryptToken);

        if (user && user.email === email) {
            return new ReadableUser(user);
        }

        throw new UnauthorizedException();
    }

    public async logout(userId: string, authToken: string): Promise<boolean> {
        return await this.tokenService.delete(userId, authToken).then(res => !!res.ok);
    }

    private async generateJwtToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
        return this.jwtService.sign(data, options);
    }

    private async saveJwtToken(createUserTokenDto: CreateUserTokenDto) {
        return await this.tokenService.create(createUserTokenDto);
    }

    private async sendConfirmation(user: IUser) {
        const expiresIn = 60 * 60 * 24; // 24 hours
        const tokenPayload = {
            _id: user._id,
            status: user.status,
            roles: user.roles,
        };

        const expireAt = moment()
            .add(1, 'day')
            .toISOString(true);
        const token = await this.generateJwtToken(tokenPayload, { expiresIn });
        await this.saveJwtToken({ token, uId: user._id, expireAt, encryptedMasterKey: '', encryptedEmailForCheck: '' });
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

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<boolean> {
        const user = await this.userService.find(userId);

        if (user && (await this.cryptService.compare(changePasswordDto.oldPassword, user.password))) {
            const password = await this.userService.hashPassword(changePasswordDto.newPassword);

            // шифруем
            await this.accountsService.changeMasterKeyForAllAccounts(userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
            await this.userService.update(userId, { password });
            await this.tokenService.deleteAll(userId);
            return true;
        } else {
            throw new BadRequestException('Invalid credentials');
        }
    }

    async deleteUser(userId: string, masterPassword: string): Promise<boolean> {
        const user = await this.userService.find(userId);

        if (user && (await this.cryptService.compare(masterPassword, user.password))) {
            await this.tokenService.deleteAll(userId);
            await this.accountsService.deleteAllAccounts(userId);
            await user.remove();
            return true;
        } else {
            throw new BadRequestException('Invalid credentials');
        }
    }

    async confirm(token: string): Promise<IUser> {
        const data = await this.verifyJwtToken(token);
        const user = await this.userService.find(data._id);

        await this.tokenService.delete(data._id, token);

        if (user && user.status === statusEnum.pending) {
            user.status = statusEnum.active;
            return user.save();
        }
        throw new BadRequestException('Confirmation error');
    }

    private async verifyJwtToken(token): Promise<ITokenPayload> {
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
}
