import { LogoutTimeEnum } from '../enums/logoutTime.enum';
import { RolesEnum } from '../enums/roles.enum';

export class CreateUserDto {
    email: string;
    password: string;
    roles: RolesEnum[];
    passwordHint: string;
    secretQuestion: string;
    logoutTime: LogoutTimeEnum;
}
