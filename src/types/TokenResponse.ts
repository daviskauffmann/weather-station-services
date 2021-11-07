import { IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Token response',
})
export default class TokenResponse {
    @Field({
        description: 'Access token',
    })
    @IsString()
    accessToken!: string;

    @Field({
        description: 'Refresh token',
    })
    @IsString()
    refreshToken!: string;

    @Field({
        description: 'Access token expiry (seconds)',
    })
    @IsNumber()
    expires!: number;
}
