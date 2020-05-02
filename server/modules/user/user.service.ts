import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CryptService } from '../../shared/services/crypt.service';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesEnum } from './enums/roles.enum';

@Injectable()
export class UserService {
    private readonly saltRounds = 10;
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>, private readonly cryptService: CryptService) {}

    async create(createUserDto: CreateUserDto, roles: RolesEnum[]): Promise<IUser> {
        const salt = await this.cryptService.genSalt(this.saltRounds);
        const hash = await this.cryptService.hash(createUserDto.password, salt);

        const createdUser = new this.userModel({ ...createUserDto, password: hash, roles });
        return await createdUser.save();
    }

    async find(id: string): Promise<IUser> {
        return await this.userModel.findById(id).exec();
    }
}
