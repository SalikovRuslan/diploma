import { Document } from 'mongoose';

import { LogoutTimeEnum } from '../enums/logoutTime.enum';
import { RolesEnum } from '../enums/roles.enum';

export interface IUser extends Document {
    email: string;
    password: string;
    roles: RolesEnum[];
    passwordHint: string;
    secretQuestion: string;
    logoutTime: LogoutTimeEnum;
}
