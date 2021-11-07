import { IsInt, IsOptional } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { FindManyResult } from '../services/DataService';

@ObjectType({
    description: 'List response',
})
export default abstract class ListResponse<T> {
    abstract items: T[];

    @Field(() => Int, {
        description: 'Total count',
        nullable: true,
    })
    @IsInt()
    @IsOptional()
    total?: number;

    @Field(() => Int, {
        description: 'Page size',
        nullable: true,
    })
    @IsInt()
    @IsOptional()
    pageSize?: number;

    @Field(() => Int, {
        description: 'Page number',
        nullable: true,
    })
    @IsInt()
    @IsOptional()
    pageNumber?: number;

    constructor(result: FindManyResult<T>, pageSize?: number, pageNumber?: number) {
        this.total = result.total;
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
    }
}
