import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ReadableUser } from '../user/models/readable-user.model';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/registration')
    async registration(@Body(ValidationPipe) data: CreateUserDto): Promise<boolean> {
        const a = '';
        console.log(a);
        return await this.authService.registration(data);
    }

    @Post('/login')
    async login(@Body(ValidationPipe) data: LoginDto): Promise<ReadableUser> {
        return await this.authService.login(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/load')
    async load(@Req() req: any): Promise<ReadableUser> {
        return this.authService.loadUser(req.user._id);
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
