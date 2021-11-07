import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import UserEntity from '../entities/UserEntity';

@ObjectType({
    description: 'User',
})
export default class User {
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
    @IsEmail()
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
