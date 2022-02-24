import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { FindManyResult } from '../services/DataService';
import ListResponse from './ListResponse';
import Station from './Station';

export default class ListStationsResponse extends ListResponse<Station> {
    @ValidateNested({ each: true })
    @Type(() => Station)
    items: Station[];

    @IsInt()
    @IsOptional()
    total?: number;

    @IsInt()
    @IsOptional()
    pageSize?: number;

    @IsInt()
    @IsOptional()
    pageNumber?: number;

    constructor(result: FindManyResult<Station>, pageSize?: number, pageNumber?: number) {
        super(result, pageSize, pageNumber);
        this.items = result.entities.map(station => new Station(station));
    }
}
