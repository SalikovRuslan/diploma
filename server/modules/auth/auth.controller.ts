import { BadRequestException, Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ReadableUser } from '../user/models/readable-user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/registration')
    async registration(@Body(ValidationPipe) data: CreateUserDto): Promise<boolean> {
        return await this.authService.registration(data);
    }

    @Post('/login')
    async login(@Body(ValidationPipe) data: LoginDto): Promise<ReadableUser> {
        return await this.authService.login(data);
    }

    @Get('/confirm')
    async confirm(@Body() confirmData: { token: string }) {
        // TODO add Dto for this action
        if (typeof confirmData.token !== 'string') {
            return new BadRequestException('token is not string');
        }
        await this.authService.confirm(confirmData.token);
        return true;
    }
}
