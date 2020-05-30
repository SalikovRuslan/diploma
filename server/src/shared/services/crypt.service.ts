import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class CryptService {
    async genSalt(rounds?: number): Promise<string> {
        return await bcryptjs.genSalt(rounds);
    }

    async hash(s: string, salt: number | string): Promise<string> {
        return await bcryptjs.hash(s, salt);
    }

    async compare(str: string, hash: string): Promise<boolean> {
        return await bcryptjs.compare(str, hash)
    }
}
