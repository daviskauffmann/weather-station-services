import { IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Station token response',
})
export default class StationTokenResponse {
    @Field({
        description: 'Access token',
    })
    @IsString()
    accessToken!: string;
}
