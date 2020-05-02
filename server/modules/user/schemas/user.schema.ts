import * as mongoose from 'mongoose';

import { LogoutTimeEnum } from '../enums/logoutTime.enum';
import { RolesEnum } from '../enums/roles.enum';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true, enum: Object.values(RolesEnum) },
    passwordHint: { type: String, default: null },
    secretQuestion: { type: String, default: null },
    logoutTime: { type: Number, default: LogoutTimeEnum.fifteenMinutes, enum: Object.values(LogoutTimeEnum) },
});

UserSchema.index({ email: 1 }, { unique: true });
