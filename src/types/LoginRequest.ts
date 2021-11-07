import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class LoginRequest {
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
