import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
    // uId is user's id
    uId: { type: String, required: true },
    date: { type: Date, required: true },
    encryptedContainer: { type: String, required: true },
    // name: { type: String, required: true },
    // username: { type: String, required: true },
    // password: { type: String, required: true },
    // url: { type: String },
});
