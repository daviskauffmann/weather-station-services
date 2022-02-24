import { IsString } from 'class-validator';

export default class LoginRequest {
    @IsString()
    username!: string;

    @IsString()
    password!: string;
}
