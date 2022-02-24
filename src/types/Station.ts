import { IsNumber, IsString } from 'class-validator';
import StationEntity from '../entities/StationEntity';

export default class Station {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    constructor(station: StationEntity) {
        this.id = station.id;
        this.name = station.name;
    }
}
