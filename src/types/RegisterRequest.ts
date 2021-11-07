import { IsEmail, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class RegisterRequest {
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
