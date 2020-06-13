import { Document } from 'mongoose';

export class IAccount extends Document {
    _id: string;
    uId: string;
    date: Date;
    encryptedContainer: string;
}
