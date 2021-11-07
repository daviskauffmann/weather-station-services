import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class CreateStationRequest {
    @Field({
        description: 'Set name',
    })
    @IsString()
    name!: string;
}
