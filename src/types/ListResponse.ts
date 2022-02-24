import { IsInt, IsOptional } from 'class-validator';
import { FindManyResult } from '../services/DataService';

export default abstract class ListResponse<T> {
    abstract items: T[];

    @IsInt()
    @IsOptional()
    total?: number;

    @IsInt()
    @IsOptional()
    pageSize?: number;

    @IsInt()
    @IsOptional()
    pageNumber?: number;

    constructor(result: FindManyResult<T>, pageSize?: number, pageNumber?: number) {
        this.total = result.total;
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
    }
}
