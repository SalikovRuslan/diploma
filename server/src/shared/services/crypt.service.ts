import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto-js';
import { Hashes } from 'crypto-js';

@Injectable()
export class CryptService {
    constructor() {}

    async genSalt(rounds?: number): Promise<string> {
        return await bcryptjs.genSalt(rounds);
    }

    async hash(s: string, salt: number | string): Promise<string> {
        return await bcryptjs.hash(s, salt);
    }

    async compare(str: string, hash: string): Promise<boolean> {
        return await bcryptjs.compare(str, hash);
    }

    encryptData(data: string, key: string): string {
        return this.crypto.AES.encrypt(data, key).toString();
    }

    decryptData(data: string, key: string): string {
        return this.crypto.AES.decrypt(data, key).toString(this.crypto.enc.Utf8);
    }

    get crypto(): Hashes {
        return crypto;
    }
}
