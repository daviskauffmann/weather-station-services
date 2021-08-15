import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import StationEntity from '../entities/StationEntity';
import { FindManyResult } from '../services/DataService';
import ListRequest from './ListRequest';

@ObjectType({
    description: 'Station',
})
export class Station {
    @Field({
        description: 'ID',
    })
    @IsNumber()
    id: number;

    @Field({
        description: 'Name',
    })
    @IsString()
    name: string;

    constructor(station: StationEntity) {
        this.id = station.id;
        this.name = station.name;
    }
}

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
export class ListStationsResponse {
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
        this.items = result.entities.map(station => new Station(station));
        this.total = result.total;
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
    }
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
