import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import { Station } from '../entities/station';
import { FindManyResult } from '../services/data-service';
import { ListRequest } from './list-request';

@ArgsType()
export class ListStationsRequest extends ListRequest {
    @Field({
        description: 'Filter by name',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    name?: string;
}

@ObjectType({
    description: 'List stations response',
})
export class ListStationsResponse implements FindManyResult<Station> {
    @Field(() => [Station], {
        description: 'Stations',
    })
    @ValidateNested({ each: true })
    @Type(() => Station)
    items!: Station[];

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
}

@ArgsType()
export class CreateStationRequest {
    @Field({
        description: 'Set name',
    })
    @IsString()
    name!: string;
}

@ArgsType()
export class UpdateStationRequest {
    @Field({
        description: 'Set name',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    name?: string;
}
