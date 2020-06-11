import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // uId is user's id
    uId: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    url: { type: String },
    date: { type: Date, required: true },
});
