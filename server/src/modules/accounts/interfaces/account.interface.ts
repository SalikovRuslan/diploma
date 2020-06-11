import { Document } from 'mongoose';

export class IAccount extends Document {
    _id: string;
    name: string;
    uId: string;
    username: string;
    password: string;
    url: string;
    date: Date;
}
