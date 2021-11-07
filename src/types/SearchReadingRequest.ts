import { IsNumber, IsOptional } from 'class-validator';

export default class SearchReadingRequest {
    @IsNumber()
    @IsOptional()
    stationId?: number;
}
