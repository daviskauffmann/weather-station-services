import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class UpdateStationRequest {
    @Field({
        description: 'Set name',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    name?: string;
}
