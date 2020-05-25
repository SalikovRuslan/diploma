import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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
        if (await this.findByEmail(createUserDto.email)) {
            throw new ConflictException('User already exist');
        }
        const hash = await this.hashPassword(createUserDto.password);
        const createdUser = new this.userModel({ ...createUserDto, password: hash, roles });
        return await createdUser.save();
    }

    async find(id: string): Promise<IUser> {
        return await this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<IUser> {
        return await this.userModel.findOne({ email }).exec();
    }

    async update(_id: string, payload: Partial<IUser>) {
        return await this.userModel.updateOne({ _id }, payload);
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await this.cryptService.genSalt(this.saltRounds);
        return await this.cryptService.hash(password, salt);
    }
}
