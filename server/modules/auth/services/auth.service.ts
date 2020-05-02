import { Injectable } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { RolesEnum } from '../../user/enums/roles.enum';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    public async registration(createdUserDto: CreateUserDto): Promise<number> {
        const user = this.userService.create(createdUserDto, [RolesEnum.user]);
        return user.then((createdUser) => createdUser.id);
    }
}
