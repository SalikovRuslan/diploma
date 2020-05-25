import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { AppServerModule } from '../src/main.server';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { configModule } from './configure.root';

const environment = process.env.NODE_ENV || 'development';

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: join(process.cwd(), 'dist/v1/browser'),
        }),
        configModule,
        MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        AuthModule,
        UserModule,
        TokenModule
    ],
    controllers: [],
})
export class AppModule {}
