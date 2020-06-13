import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { IUser } from '../user/interfaces/user.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { HeadersService } from '../../shared/services/headers.service';
import { IReadableUserModel } from './interfaces/readable-user.model';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService, private headersService: HeadersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createAccount(@Body(ValidationPipe) body: CreateAccountDto, @Req() req: any): Promise<any> {
        const { _id } = req.user;
        return await this.accountsService.createAccount(body, _id, this.headersService.getUserTokens(req.headers));
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update')
    async updateAccount(@Body(ValidationPipe) body: UpdateAccountDto, @Req() req: any): Promise<any> {
        const { _id } = req.user;
        return await this.accountsService.updateAccount(body, _id, this.headersService.getUserTokens(req.headers));
    }

    @UseGuards(JwtAuthGuard)
    @Post('/delete')
    async deleteAccount(@Body(ValidationPipe) body: DeleteAccountDto, @Req() req: any): Promise<any> {
        const { _id } = req.user;
        return await this.accountsService.deleteAccount(body, _id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAll')
    async getAll(@Req() req: any): Promise<IReadableUserModel[]> {
        const user: IUser = req.user;
        return await this.accountsService.getAll(user._id, this.headersService.getUserTokens(req.headers));
    }
}
