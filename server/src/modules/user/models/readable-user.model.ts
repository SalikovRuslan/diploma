import { RolesEnum } from '../enums/roles.enum';
import { LogoutTimeEnum } from '../enums/logoutTime.enum';

export class ReadableUser {
    email: string;
    status: string;
    roles: RolesEnum[];
    passwordHint: string;
    secretQuestion: string;
    logoutTime: LogoutTimeEnum;
    accessToken?: string;

    constructor(fields) {
        if (!!fields) {
            this.email = fields.email;
            this.status = fields.status;
            this.roles = fields.roles;
            this.passwordHint = fields.passwordHint;
            this.secretQuestion = fields.secretQuestion;
            this.logoutTime = fields.logoutTime;
            this.accessToken = fields.accessToken;
        }
    }
}
