import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { configModule } from './configure.root';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';

const environment = process.env.NODE_ENV || 'development';

@Module({
    imports: [
        configModule,
        MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        AuthModule,
        UserModule,
        TokenModule,
    ],
    controllers: [],
})
export class AppModule {}
