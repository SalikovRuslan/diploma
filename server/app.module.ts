import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppServerModule } from '../src/main.server';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

const environment = process.env.NODE_ENV || 'development';

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: join(process.cwd(), 'dist/v1/browser'),
        }),
        AuthModule,
        UserModule,
        ConfigModule.forRoot({
            envFilePath: `.env.${environment}`,
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
    ],
    controllers: [],
})
export class AppModule {}
