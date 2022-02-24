import { IsEmail, IsString } from 'class-validator';

export default class RegisterRequest {
    @IsString()
    username!: string;

    @IsString()
    password!: string;

    @IsEmail()
    email!: string;
}
