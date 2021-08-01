import { IsEmail, IsString } from "class-validator";
import { ArgsType, Field, ObjectType } from "type-graphql";

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
