import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';

import { configModule } from '../../configure.root';
import { JwtStrategy } from './jwt.strategy';
import { SharedModule } from '../../shared/shared.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '900' }, // 15 minute
        }),
        configModule,
        UserModule,
        TokenModule,
        SharedModule,
        AccountsModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
