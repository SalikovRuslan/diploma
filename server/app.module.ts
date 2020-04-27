import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';

import { AppServerModule } from '../src/main.server';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: join(process.cwd(), 'dist/v1/browser'),
        }),
        AuthModule,
    ],
    controllers: [],
})
export class AppModule {}
