import { IsNumber, IsString } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ArgsType()
export class RefreshTokenRequest {
    @Field({
        description: 'Refresh token',
    })
    @IsString()
    refreshToken!: string;
}

@ObjectType({
    description: 'Access token response',
})
export class AccessTokenResponse {
    @Field({
        description: 'Access token',
    })
    @IsString()
    accessToken!: string;
}

@ObjectType({
    description: 'Access and refresh token response',
})
export class AccessAndRefreshTokenResponse {
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
