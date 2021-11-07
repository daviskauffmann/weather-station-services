import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class RefreshRequest {
    @Field({
        description: 'Refresh token',
    })
    @IsString()
    refreshToken!: string;
}
