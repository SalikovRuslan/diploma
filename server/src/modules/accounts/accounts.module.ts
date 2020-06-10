import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { configModule } from '../../configure.root';
import { SharedModule } from '../../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AccountsService } from './accounts.service';

import { AccountSchema } from './schemas/account.schema';
import { AccountsController } from './accounts.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Account',
                schema: AccountSchema,
            },
        ]),
        configModule,
        UserModule,
        SharedModule,
    ],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
