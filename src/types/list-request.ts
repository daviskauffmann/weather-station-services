import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ListRequest {
    @Field({
        description: 'Return total count',
        nullable: true,
    })
    @IsBoolean()
    @IsOptional()
    total?: boolean;

    @Field(() => Int, {
        description: 'Set page size',
        defaultValue: 100,
        nullable: true,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    pageSize?: number = 100;

    @Field(() => Int, {
        description: 'Set page number',
        defaultValue: 0,
        nullable: true,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    pageNumber?: number = 0;
}
