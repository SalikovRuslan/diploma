import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { Hashes } from 'crypto-js';

@Injectable()
export class CryptoService {
    constructor() {}

    get crypto(): Hashes {
        return crypto;
    }
}
