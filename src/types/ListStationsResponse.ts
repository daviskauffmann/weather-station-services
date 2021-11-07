import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { FindManyResult } from '../services/DataService';
import ListResponse from './ListResponse';
import Station from './Station';

@ObjectType({
    description: 'List stations response',
})
export default class ListStationsResponse extends ListResponse<Station> {
    @Field(() => [Station], {
        description: 'Stations',
    })
    @ValidateNested({ each: true })
    @Type(() => Station)
    items: Station[];

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

    constructor(result: FindManyResult<Station>, pageSize?: number, pageNumber?: number) {
        super(result, pageSize, pageNumber);
        this.items = result.entities.map(station => new Station(station));
    }
}
