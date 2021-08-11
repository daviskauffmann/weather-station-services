import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class GetRequest {
    @Field(() => [String], {
        description: 'Select fields',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    select?: string;

    @Field(() => [String], {
        description: 'Load relations',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    relations?: string;
}
