import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ListRequest {
    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    total?: boolean;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    pageSize?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    pageNumber?: number;
}
