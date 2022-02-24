import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import GetRequest from './GetRequest';

export default class ListRequest extends GetRequest {
    @IsBoolean()
    @IsOptional()
    total?: boolean;

    @IsInt()
    @Min(0)
    @IsOptional()
    pageSize?: number = 100;

    @IsInt()
    @Min(0)
    @IsOptional()
    pageNumber?: number = 0;
}
