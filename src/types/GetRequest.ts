import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default abstract class GetRequest {
    @Field(() => [String], {
        description: 'Select fields',
        nullable: true,
    })
    @IsString({ each: true })
    @IsOptional()
    select?: string[];

    @Field(() => [String], {
        description: 'Load relations',
        nullable: true,
    })
    @IsString({ each: true })
    @IsOptional()
    relations?: string[];
}
