import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './services/auth.service';

import { IUser } from '../user/interfaces/user.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/registration')
    async registration(@Body() data: IUser) {
        if (!data || !data.email) {
            return false;
        }

        return await this.authService.registration(data);
    }
}
