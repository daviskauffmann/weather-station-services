import { IsEmail, IsNumber, IsString } from 'class-validator';
import UserEntity from '../entities/UserEntity';

export default class User {
    @IsNumber()
    id: number;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString({ each: true })
    roles: string[];

    constructor(user: UserEntity) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.roles = user.roles;
    }
}
