import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedModule } from '../../shared/shared.module';

import { TokenService } from './token.service';
import { TokenSchema } from './schemas/user-token.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]), //
        SharedModule,
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
