import { IsDate, IsNumber } from 'class-validator';
import ReadingEntity from '../entities/ReadingEntity';

export default class Reading {
    @IsDate()
    time: Date;

    @IsNumber()
    stationId: number;

    @IsNumber()
    temperature: number;

    @IsNumber()
    rain1h: number;

    constructor(reading: ReadingEntity) {
        this.time = reading.time;
        this.stationId = reading.stationId;
        this.temperature = reading.temperature;
        this.rain1h = reading.rain1h;
    }
}
