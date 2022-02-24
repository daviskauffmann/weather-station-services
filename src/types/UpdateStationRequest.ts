import { IsOptional, IsString } from 'class-validator';

export default class UpdateStationRequest {
    @IsString()
    @IsOptional()
    name?: string;
}
