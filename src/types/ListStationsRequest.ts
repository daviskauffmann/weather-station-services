import { IsOptional, IsString } from 'class-validator';
import ListRequest from './ListRequest';

export default class ListStationsRequest extends ListRequest {
    @IsString()
    @IsOptional()
    name?: string;
}
