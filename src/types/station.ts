import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import { Station } from '../entities/station';
import { FindManyResult } from '../services/data-service';
import { ListRequest } from './list-request';

@ArgsType()
export class ListStationsRequest extends ListRequest {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;
}

@ObjectType()
export class ListStationsResponse implements FindManyResult<Station> {
    @Field(() => [Station])
    @ValidateNested({ each: true })
    @Type(() => Station)
    items!: Station[];

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    total?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    pageSize?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    pageNumber?: number;
}

@ArgsType()
export class CreateStationRequest {
    @Field()
    @IsString()
    name!: string;
}

@ArgsType()
export class UpdateStationRequest {
    @Field()
    @IsString()
    @IsOptional()
    name?: string;
}
