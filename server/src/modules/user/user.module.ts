import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedModule } from '../../shared/shared.module';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
        SharedModule,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
