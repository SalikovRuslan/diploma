import { RolesEnum } from '../enums/roles.enum';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
    // @IsEmail()
    @Matches(/[\w-]+@([\w-]+\.)+[\w-]+/, { message: 'is not email' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    // @Matches(
    //     /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    //     { message: 'Weak password' },
    // )
    password: string;

    roles: RolesEnum[];

    @IsString()
    @IsOptional()
    passwordHint: string;

    @IsString()
    @IsOptional()
    secretQuestion: string;
}
