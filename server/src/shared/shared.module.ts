import { Module } from '@nestjs/common';

import { CryptService } from './services/crypt.service';
import { HeadersService } from './services/headers.service';

@Module({
    providers: [CryptService, HeadersService],
    exports: [CryptService, HeadersService],
})
export class SharedModule {}
