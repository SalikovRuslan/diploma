import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DateUtils } from '../../shared/utils/date.utils';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccount } from './interfaces/account.interface';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class AccountsService {
    constructor(@InjectModel('Account') private readonly accountModel: Model<IAccount>) {}

    public async createAccount(createAccountDto: CreateAccountDto, userId: string): Promise<IAccount> {
        const account = new this.accountModel({ ...createAccountDto, uId: userId, date: DateUtils.getNow() });
        return await account.save();
    }

    public async getAll(userId: string): Promise<IAccount[]> {
        return this.accountModel.find({ uId: userId });
    }

    async updateAccount(body: UpdateAccountDto, userId: any): Promise<IAccount> {
        const account = await this.findAccount(body._id);
        if (account.uId !== userId) {
            // Accounts uId does not match current user's id
            throw new NotAcceptableException("No permission to edit");
        }
        Object.assign(account, { ...body, date: DateUtils.getNow() });
        return await account.save();
    }

    async deleteAccount(body: DeleteAccountDto, userId: any) {
        const account = await this.findAccount(body._id);
        if (account.uId !== userId) {
            // Accounts uId does not match current user's id
            throw new NotAcceptableException("No permission to delete");
        }
        return await account.remove();
    }

    private async findAccount(id: string): Promise<IAccount> {
        let account;
        try {
            account = await this.accountModel.findById(id).exec();
        } catch (e) {
            throw new NotFoundException('Could not find account.');
        }

        if (!account) {
            throw new NotFoundException('Could not find account.');
        }
        return account;
    }
}
