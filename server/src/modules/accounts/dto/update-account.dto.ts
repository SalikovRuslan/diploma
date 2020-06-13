import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto {
    @IsString()
    @IsNotEmpty()
    _id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    url: string;

    @IsString()
    @IsOptional()
    notes: string;
}
