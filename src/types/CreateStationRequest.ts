import { IsString } from 'class-validator';

export default class CreateStationRequest {
    @IsString()
    name!: string;
}
