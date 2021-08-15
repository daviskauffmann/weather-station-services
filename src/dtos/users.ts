import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';
import UserEntity from '../entities/UserEntity';

@ObjectType({
    description: 'User',
})
export class User {
    @Field({
        description: 'ID',
    })
    @IsNumber()
    id: number;

    @Field({
        description: 'Username',
    })
    @IsString()
    username: string;

    @Field({
        description: 'Email',
    })
    @IsString()
    email: string;

    @Field(() => [String], {
        description: 'Roles',
    })
    @IsString({ each: true })
    roles: string[];

    constructor(user: UserEntity) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.roles = user.roles;
    }
}

@ArgsType()
export class UserRegisterRequest {
    @Field({
        description: 'Set username',
    })
    @IsString()
    username!: string;

    @Field({
        description: 'Set password',
    })
    @IsString()
    password!: string;

    @Field({
        description: 'Set email',
    })
    @IsEmail()
    email!: string;
}

@ArgsType()
export class UserLoginRequest {
    @Field({
        description: 'Username',
    })
    @IsString()
    username!: string;

    @Field({
        description: 'Password',
    })
    @IsString()
    password!: string;
}
