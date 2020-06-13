import { Injectable, NotAcceptableException, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DateUtils } from '../../shared/utils/date.utils';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccount } from './interfaces/account.interface';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { TokenService } from '../token/token.service';
import { IUserTokens } from '../token/interfaces/tokens.interface';
import { CryptService } from '../../shared/services/crypt.service';
import { IReadableUserModel } from './interfaces/readable-user.model';
import { AccountContainerInterface } from './interfaces/account-container.interface';

@Injectable()
export class AccountsService {
    constructor(
        @InjectModel('Account') private readonly accountModel: Model<IAccount>,
        private cryptService: CryptService,
        private tokenService: TokenService,
    ) {}

    public async createAccount(
        createAccountDto: CreateAccountDto,
        userId: string,
        { authToken, cryptToken }: IUserTokens,
    ): Promise<IAccount> {
        const { encryptedMasterKey } = await this.tokenService.getTokenModel(authToken);
        const decryptedMasterKey = this.cryptService.decryptData(encryptedMasterKey, cryptToken);
        const encryptedAccountContainer = this.encryptAccountContainer(createAccountDto, decryptedMasterKey);

        const account = new this.accountModel({ uId: userId, date: DateUtils.getNow(), encryptedContainer: encryptedAccountContainer });
        return await account.save();
    }

    public async getAll(userId: string, { authToken, cryptToken }: IUserTokens): Promise<IReadableUserModel[]> {
        const { encryptedMasterKey } = await this.tokenService.getTokenModel(authToken);
        const decryptedMasterKey = this.cryptService.decryptData(encryptedMasterKey, cryptToken);
        const accounts: IAccount[] = await this.accountModel.find({ uId: userId });

        return !!accounts
            ? accounts.map(account => ({
                  _id: account._id,
                  uId: account.uId,
                  date: account.date,
                  ...this.decryptAccountContainer(account.encryptedContainer, decryptedMasterKey),
              }))
            : [];
    }

    async updateAccount(body: UpdateAccountDto, userId: any, { authToken, cryptToken }: IUserTokens): Promise<IAccount> {
        const account = await this.findAccount(body._id);
        if (account.uId !== userId) {
            // Accounts uId does not match current user's id
            throw new NotAcceptableException('No permission to edit');
        }

        const { encryptedMasterKey } = await this.tokenService.getTokenModel(authToken);
        const decryptedMasterKey = this.cryptService.decryptData(encryptedMasterKey, cryptToken);
        //
        const updatedAccount = {
            ...this.decryptAccountContainer(account.encryptedContainer, decryptedMasterKey),
            ...this.createAccountContainer(body),
        };

        Object.assign(account, {
            encryptedContainer: this.encryptAccountContainer(updatedAccount, decryptedMasterKey),
            date: DateUtils.getNow(),
        });
        return await account.save();
    }

    async deleteAccount(body: DeleteAccountDto, userId: any) {
        const account = await this.findAccount(body._id);
        if (account.uId !== userId) {
            // Accounts uId does not match current user's id
            throw new NotAcceptableException('No permission to delete');
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

    private decryptAccountContainer(container: string, key: string): AccountContainerInterface {
        try {
            return JSON.parse(this.cryptService.decryptData(container, key));
        } catch (e) {}
    }

    private encryptAccountContainer(container: AccountContainerInterface, masterKey: string): string {
        return this.cryptService.encryptData(JSON.stringify(container), masterKey);
    }

    private createAccountContainer(data: CreateAccountDto | UpdateAccountDto): AccountContainerInterface {
        return {
            name: data.name,
            username: data.username,
            password: data.password,
            url: data.url,
            notes: data.notes,
        };
    }
}
